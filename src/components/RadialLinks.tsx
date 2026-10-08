import { useState, type CSSProperties } from 'react';
import {
  TwitchLogo, TiktokLogo, YoutubeLogo, XLogo, DiscordLogo,
  PatreonLogo, Gift, HandHeart, EnvelopeSimple, CalendarStar, Link as LinkIcon,
  ArrowUpRight,
} from '@phosphor-icons/react';
import type { SiteContent } from '../content';
import './radial-links.css';
const icons = {
  twitch: TwitchLogo, tiktok: TiktokLogo, youtube: YoutubeLogo, twitter: XLogo,
  discord: DiscordLogo, patreon: PatreonLogo, throne: Gift, tip: HandHeart,
  email: EnvelopeSimple, twitchcon: CalendarStar,
};
export function RadialLinks({links}:{links:SiteContent['links']}) {
  const [touchSelection,setTouchSelection]=useState<string|null>(null);
  const visible=links.filter(link=>!link.hidden);
  // Additional owner-created links remain usable without packing an unreadable orbit.
  const orbit=visible.slice(0,10);
  const overflow=visible.slice(10);
  function iconFor(id:string) {return icons[id as keyof typeof icons]??LinkIcon;}
  return <section className="radial-links" aria-labelledby="links-heading">
    <h2 id="links-heading">Find me<br/><em>around the internet.</em></h2>
    <p className="orbit-hint"><span className="pointer-hint">Hover an icon to explore.</span><span className="touch-hint">Tap an icon for its name. Tap again to visit.</span></p>
    {visible.length===0?<p>No links to share just yet.</p>:<>
      <nav className="orbit" aria-label="Veri’s social links" onKeyDown={event=>{if(event.key==='Escape')setTouchSelection(null);}}>
        <div className="orbit-center" aria-hidden="true"><img src="/images/tenko-seal-original.png" alt=""/><span>VERI</span><small>EVERY LITTLE<br/>CORNER OF MY WORLD</small></div>
        <ul className="orbit-list">{orbit.map((link,index)=>{
          const angle=-Math.PI/2+(index/Math.max(orbit.length,1))*Math.PI*2;
          const Icon=iconFor(link.id);
          const position={'--orbit-x':Math.cos(angle),'--orbit-y':Math.sin(angle)} as CSSProperties;
          return <li key={link.id} style={position} className={`orbit-node ${Math.cos(angle)<-.1?'expand-left':'expand-right'} ${Math.abs(Math.cos(angle))<.1?'center-node':''}`}>
            <a href={link.url} aria-label={link.label} target={link.url.startsWith('https:')?'_blank':undefined} rel="noopener noreferrer"
              className={`orbit-link ${touchSelection===link.id?'is-expanded':''}`}
              onClick={event=>{if(event.detail>0&&matchMedia('(hover: none)').matches&&touchSelection!==link.id){event.preventDefault();setTouchSelection(link.id);}}}>
              <span className="orbit-icon"><Icon size={27} weight="fill" aria-hidden="true"/></span>
              <span className="orbit-label"><span className="orbit-name">{link.label}</span><ArrowUpRight size={16} aria-hidden="true"/></span>
            </a>
          </li>;
        })}</ul>
      </nav>
      {overflow.length>0&&<nav className="extra-links" aria-label="More links">{overflow.map(link=>{const Icon=iconFor(link.id);return <a key={link.id} href={link.url} target={link.url.startsWith('https:')?'_blank':undefined} rel="noopener noreferrer"><Icon aria-hidden="true"/>{link.label}<ArrowUpRight aria-hidden="true"/></a>;})}</nav>}
    </>}
  </section>;
}
