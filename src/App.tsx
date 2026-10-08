import { useEffect, useState } from 'react';
import { ArrowRight, ArrowLeft, House, User, Link as LinkIcon, Heart, Storefront, Scroll, StarFour, TwitchLogo, DiscordLogo, EnvelopeSimple, ArrowsOutSimple, NotePencil, Megaphone } from '@phosphor-icons/react';
import { initialContent, type SiteContent } from './content';
import './styles.css';
import { SectionFrame } from './components/SectionFrame';
import { RadialLinks } from './components/RadialLinks';
import { Updates } from './components/Updates';
import { BowAccent } from './components/BowAccent';
import { OwnerAccess } from './components/OwnerAccess';
import { loadPublished } from './services/contentStore';
const sections = ['shrine','about','links','credits','rules','merch','updates'] as const;
type Section = typeof sections[number];
const labels: Record<Section,string> = {shrine:'Shrine',about:'About Veri',links:'Links',credits:'Credits',rules:'Stream rules',merch:'Merch',updates:'Updates'};
function sectionFromUrl(): Section | 'home' { const value = location.hash.slice(1); return sections.find(s=>s===value) ?? 'home'; }
function OutLink({href,children,className=''}:{href:string;children:React.ReactNode;className?:string}) { return <a className={className} href={href} target={href.startsWith('https:')?'_blank':undefined} rel="noopener noreferrer">{children}</a>; }
export function App() {
  const [section,setSection] = useState<Section|'home'>(sectionFromUrl);
  const [content,setContent] = useState<SiteContent>(initialContent);
  const [editing,setEditing] = useState(false);
  const [preview,setPreview] = useState(false);
  const [previewRevision,setPreviewRevision] = useState<number>();
  const [published,setPublished] = useState<SiteContent>(initialContent);
  const [contentError,setContentError] = useState('');
  useEffect(()=>{let active=true;loadPublished().then(value=>{if(active&&value){setContent(value);setPublished(value);}}).catch(()=>{if(active)setContentError('Live content could not be loaded. Showing the saved site defaults.');});return()=>{active=false;};},[]);
  const [expanded,setExpanded] = useState(false);
  useEffect(()=>{const change=()=>{setSection(sectionFromUrl());document.querySelector<HTMLElement>('.window-content')?.scrollTo(0,0);};addEventListener('hashchange',change);return()=>removeEventListener('hashchange',change);},[]);
  useEffect(()=>{document.title=`${section==='home'?'Veri':labels[section]} · The Scuffox Shrine`;},[section]);
  const twitch=content.links.find(l=>l.id==='twitch'&&!l.hidden);
  const discord=content.links.find(l=>l.id==='discord'&&!l.hidden);
  const featured=content.updates.filter(post=>!post.archived).sort((a,b)=>Number(b.pinned)-Number(a.pinned)||b.date.localeCompare(a.date))[0];
  const actions=<div className="actions">{twitch&&<OutLink className="button primary" href={twitch.url}><TwitchLogo size={25}/>Watch on Twitch<ArrowRight/></OutLink>}{discord&&<OutLink className="button secondary" href={discord.url}><DiscordLogo size={25}/>Join Discord<ArrowRight/></OutLink>}</div>;
  const nav = (items:Section[])=>items.map(item=>{const Icon={shrine:House,about:User,links:LinkIcon,credits:StarFour,rules:Scroll,merch:Storefront,updates:Megaphone}[item];return <a key={item} href={`#${item}`} className={section===item?'selected':''} aria-current={section===item?'page':undefined}><Icon size={28} weight={section===item?'fill':'regular'}/><span>{labels[item]}</span></a>;});
  return <>
    <a className="skip" href="#main-content" onClick={event=>{event.preventDefault();document.getElementById("main-content")?.focus();}}>Skip to content</a>
    {contentError&&<p className="content-error" role="status">{contentError}</p>}
    {preview&&<div className="preview-banner">Draft preview · visible only in this browser <button onClick={()=>setEditing(true)}>Continue editing</button><button onClick={()=>{setContent(published);setPreview(false);}}>Exit preview</button></div>}
    <header className="topbar"><a href="#home" className="brand" aria-label="Veri home"><img src="/images/tenko-seal-original.png" alt="Veri’s Tenko seal"/><b>VERI</b></a><span className="brand-caption">THE SCUFFOX SHRINE</span><nav aria-label="Top navigation">{(['home','about','links','credits'] as const).map(item=><a key={item} href={`#${item}`} aria-current={section===item?'page':undefined}>{item==='home'?'Home':item[0].toUpperCase()+item.slice(1)}</a>)}</nav></header><nav className="quick-nav" aria-label="Community navigation"><a href="#rules"><Scroll/>Stream rules</a><a href="#merch"><Storefront/>Merch</a><a href="#updates"><Megaphone/>Updates</a></nav>
    {section==='home'?<main id="main-content" tabIndex={-1} className="splash"><div className="hero-copy"><div className="welcome">WELCOME TO <StarFour weight="fill"/></div><h1>THE<br/><em>SCUFFOX</em><br/>SHRINE</h1><p className="tagline">{content.tagline}</p>{actions}<p className="intro">{content.intro}</p><a className="enter" href="#shrine"><span className="signature">Veri</span><BowAccent/><span className="signature-line"/><span className="signature-note">SAME CHAOS<br/>DIFFERENT DAY <ArrowRight size={16}/></span></a></div><div className="hero-art"><div className="art-disc"/><span className="art-motto">PLAY<br/>LAUGH<br/>BE HERE</span><StarFour className="hero-star" weight="fill" aria-hidden="true"/><img src={content.splashImage} alt="Veri, a white-haired fox-eared character with a staff and glowing magic in her hand" style={{objectPosition:`${content.imagePosition}% top`}}/></div><footer className="splash-footer"><a href="#links"><LinkIcon size={34}/><div>All my links<small>AROUND THE INTERNET</small></div></a><a href="#merch"><Heart size={38} weight="fill"/><div>Support<small>FUEL THE CHAOS</small></div></a><a href="mailto:veri@verivt.stream"><EnvelopeSimple size={36}/><div>Contact<small>GET IN TOUCH</small></div></a><span>THANKS FOR BEING HERE <StarFour weight="fill"/></span></footer></main>:<main id="main-content" tabIndex={-1} className={`desktop ${expanded?'expanded':''}`}><nav className="side-menu left" aria-label="Explore">{nav(['shrine','about','links'])}</nav><article className="content-window"><header className="window-bar"><a href="#home" aria-label="Back to splash"><ArrowLeft size={22}/></a><span>{labels[section]}</span><button aria-label={expanded?'Restore window':'Expand window'} onClick={()=>setExpanded(!expanded)}><ArrowsOutSimple size={21}/></button></header><div className="window-content" tabIndex={0}><SectionFrame section={section}>
    {featured&&section!=='updates'&&<a className="update-strip" href="#updates"><Megaphone/>Latest: {featured.title}<ArrowRight/></a>}
    {section==='shrine'&&<><div className="inside-welcome"><div><span className="small-label">MAKE YOURSELF AT HOME</span><h2>A little chaos.<br/><em>A little comfort.</em></h2><p>A place to belong. Welcome to the Scuffox Shrine.</p>{actions}</div><img src={content.splashImage} alt="Veri"/></div><div className="destination-list"><a href="#rules"><Scroll/><div><h3>Before we get chaotic</h3><p>Read the stream rules.</p></div><ArrowRight/></a><a href="#updates"><Megaphone/><div><h3>Notes from Veri</h3><p>Announcements and little life updates.</p></div><ArrowRight/></a></div></>}
    {section==='about'&&<><h2>Oh, hey.<br/><em>I’m Veri.</em></h2><p className="prose">{content.about}</p>{actions}</>}
    {section==='links'&&<RadialLinks links={content.links}/>}
    {section==='rules'&&<><h2>Good company.<br/><em>A few ground rules.</em></h2>{content.rules?<p className="prose">{content.rules}</p>:<Empty title="The house rules are being written." text="Veri will publish the stream rules here."/>}</>}
    {section==='credits'&&<><h2>The people<br/><em>behind the magic.</em></h2>{content.credits?<p className="prose">{content.credits}</p>:<Empty title="Credits are on their way." text="Artist names and attribution links will appear here once provided."/>}</>}
    {section==='merch'&&<><h2>A little Veri.<br/><em>For your real life.</em></h2>{content.merchUrl?<><p>Browse the collection in Veri’s official shop.</p><OutLink href={content.merchUrl} className="button primary"><Storefront/>Visit the shop<ArrowRight/></OutLink></>:<Empty title="The merch shelf is getting ready." text="The official storefront link will be added here."/>}</>}
    {section==='updates'&&<Updates posts={content.updates}/>}
    </SectionFrame></div></article><nav className="side-menu right" aria-label="More at the shrine">{nav(['updates','merch','credits'])}</nav></main>}
    <footer className="site-footer"><span>Veri · The Scuffox Shrine</span><a href="mailto:veri@verivt.stream"><EnvelopeSimple/>Say hello</a><button onClick={()=>setEditing(true)}><NotePencil/>Edit site</button></footer>
    {editing&&<OwnerAccess previewRevision={previewRevision} preferPreview={preview} content={content} onPublished={value=>{setContent(value);setPublished(value);setPreview(false);setEditing(false);}} onClose={()=>setEditing(false)} onPreview={(draft,revision)=>{setPreviewRevision(revision);setContent(draft);setPreview(true);setEditing(false);}}/>}
  </>;
}
function Empty({title,text}:{title:string;text:string}) {return <div className="empty"><StarFour size={32}/><h3>{title}</h3><p>{text}</p></div>;}
