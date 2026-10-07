import { useEffect, useState } from 'react';
import { z } from 'zod';
import { supabase, loadDraft } from '../services/contentStore';
import { Editor } from './Editor';
import type { SiteContent } from '../content';
interface OwnerAccessProps {
  content:SiteContent;
  preferPreview:boolean;
  previewRevision?:number;
  onClose:()=>void;
  onPreview:(content:SiteContent,revision?:number)=>void;
  onPublished:(content:SiteContent)=>void;
}
export function OwnerAccess(props:OwnerAccessProps) {
  const [owner,setOwner]=useState<{draft:SiteContent;revision:number}|null>(null);
  const [checking,setChecking]=useState(Boolean(supabase));
  const [email,setEmail]=useState('');
  const [message,setMessage]=useState('');
  const [sending,setSending]=useState(false);
  useEffect(()=>{
    if (!supabase) return;
    let active=true;
    async function check() {
      setChecking(true);
      try {
        const {data}=await supabase!.auth.getSession();
        if (!data.session) {if(active)setOwner(null);return;}
        const saved=await loadDraft();
        if(active)setOwner({draft:props.preferPreview?props.content:saved.draft??props.content,revision:props.preferPreview&&props.previewRevision!==undefined?props.previewRevision:saved.revision});
      } catch(error) {if(active){setOwner(null);setMessage(error instanceof Error?error.message:'Sign-in could not be checked.');}}
      finally {if(active)setChecking(false);}
    }
    void check();
    const {data:{subscription}}=supabase.auth.onAuthStateChange(()=>{setTimeout(()=>void check(),0);});
    return()=>{active=false;subscription.unsubscribe();};
  },[]);
  useEffect(()=>{
    if(owner || !supabase) return;
    const dialog=document.querySelector<HTMLDialogElement>('#owner-access');
    dialog?.showModal();
    return()=>dialog?.close();
  },[owner]);
  if(!supabase) return <Editor {...props}/>;
  if(owner) return <Editor {...props} content={owner.draft} initialRevision={owner.revision}/>;
  async function signIn(event:React.FormEvent) {
    event.preventDefault();
    const parsed=z.string().email().safeParse(email.trim());
    if(!parsed.success){setMessage('Enter your owner email address.');return;}
    setSending(true);setMessage('');
    try {
      const {error}=await supabase!.auth.signInWithOtp({email:parsed.data,options:{shouldCreateUser:false,emailRedirectTo:location.origin}});
      if(error)throw error;
      setMessage('If this is an enrolled owner account, a sign-in link is on its way.');
    } catch {setMessage('The sign-in link could not be requested. Check the account and try again.');}
    finally {setSending(false);}
  }
  return <dialog id="owner-access" onCancel={props.onClose}><form className="owner-access" onSubmit={signIn}>
    <header><h2>Owner sign-in</h2><button type="button" onClick={props.onClose}>Close</button></header>
    <p>Sign in with the account enrolled to manage this shrine.</p>
    {checking?<p role="status">Checking your sign-in…</p>:<><label>Email address<input type="email" autoComplete="email" required value={email} onChange={event=>setEmail(event.target.value)}/></label><button disabled={sending} className="primary">{sending?'Sending…':'Send sign-in link'}</button></>}
    {message&&<p role="status">{message}</p>}
  </form></dialog>;
}
