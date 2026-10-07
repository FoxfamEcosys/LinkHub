import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { contentSchema, type SiteContent } from '../content';
const settings=z.object({url:z.string().url(),key:z.string().min(1)}).safeParse({
  url:import.meta.env.VITE_SUPABASE_URL,key:import.meta.env.VITE_SUPABASE_ANON_KEY,
});
export const supabase=settings.success?createClient(settings.data.url,settings.data.key):null;
const revisionSchema=z.object({revision:z.number().int().nonnegative()});
const draftSchema=revisionSchema.extend({draft:contentSchema.nullable()});
async function invoke(body: Record<string, unknown>) {
  if (!supabase) throw new Error('Publishing has not been connected yet.');
  const {data,error}=await supabase.functions.invoke('linkhub-admin',{body});
  if (error) {
    if ('context' in error && error.context instanceof Response) {
      const response=await error.context.json().catch(()=>null);
      const message=z.object({error:z.string()}).safeParse(response);
      if (message.success) throw new Error(message.data.error);
    }
    throw new Error('Could not reach the editor service. Your edits are still here.');
  }
  return data as unknown;
}
export async function loadPublished(): Promise<SiteContent|null> {
  if (!supabase) return null;
  const {data,error}=await supabase.from('linkhub_published').select('content').eq('id',true).maybeSingle();
  if (error) throw new Error('Live content could not be loaded. Showing the saved site defaults.');
  return data?contentSchema.parse(data.content):null;
}
export async function loadDraft() {return draftSchema.parse(await invoke({action:'load'}));}
export async function writeContent(content:SiteContent,revision:number,publish:boolean) {
  return revisionSchema.parse(await invoke({action:publish?'publish':'save',content:contentSchema.parse(content),revision})).revision;
}
export async function uploadArtwork(file:File):Promise<string> {
  if (!supabase || !settings.success) throw new Error('Artwork storage is not connected yet.');
  const {data:{session}}=await supabase.auth.getSession();
  if (!session) throw new Error('Sign in again before uploading artwork.');
  const response=await fetch(`${settings.data.url}/functions/v1/linkhub-admin`,{
    method:'POST',headers:{Authorization:`Bearer ${session.access_token}`,apikey:settings.data.key,'Content-Type':file.type},body:file,
  });
  const data:unknown=await response.json();
  if (!response.ok) {
    const result=z.object({error:z.string()}).safeParse(data);
    throw new Error(result.success?result.data.error:'Artwork could not be uploaded.');
  }
  return z.object({url:z.string().url()}).parse(data).url;
}
