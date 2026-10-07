import { useState } from 'react';
import { StarFour } from '@phosphor-icons/react';
import type { SiteContent } from '../content';
export function Updates({posts}:{posts:SiteContent['updates']}) {
  const [archive,setArchive]=useState(false);
  const visible=posts.filter(post=>post.archived===archive).sort((a,b)=>Number(b.pinned)-Number(a.pinned)||b.date.localeCompare(a.date));
  return <><h2>Notes from<br/><em>the shrine.</em></h2>
    <div className="update-tabs" aria-label="Update archive"><button aria-pressed={!archive} onClick={()=>setArchive(false)}>Latest</button><button aria-pressed={archive} onClick={()=>setArchive(true)}>Archive</button></div>
    {visible.length?<div className="posts">{visible.map(post=><article key={post.id}>
      <span>{post.pinned?'Pinned · ':''}<time dateTime={post.date}>{post.date}</time></span>
      <h3>{post.title}</h3><p className="prose">{post.body}</p>
    </article>)}</div>:<div className="empty"><StarFour size={32}/><h3>{archive?'No archived notes yet.':'A quiet moment, for now.'}</h3><p>{archive?'Older updates will be kept here.':'New announcements and updates will appear here.'}</p></div>}
  </>;
}
