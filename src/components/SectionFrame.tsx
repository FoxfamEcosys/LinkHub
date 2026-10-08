import type { ReactNode } from 'react';
import { StarFour } from '@phosphor-icons/react';
import { BowAccent } from './BowAccent';
const captions:Record<string,string>={
  shrine:'MAKE YOURSELF AT HOME',about:'THE FOX BEHIND THE CHAOS',links:'OUR LITTLE CONNECTIONS',
  credits:'THE HANDS BEHIND THE MAGIC',rules:'A LITTLE CARE GOES A LONG WAY',
  merch:'A LITTLE PIECE OF THE SHRINE',updates:'LETTERS FROM VERI',
};
export function SectionFrame({section,children}:{section:string;children:ReactNode}) {
  return <div className={`section-sheet section-sheet-${section}`}>
    <div className="section-trim" aria-hidden="true"><StarFour weight="fill"/><span/><BowAccent/><span/><StarFour weight="fill"/></div>
    <p className="section-caption">{captions[section]}</p>
    <div className="section-body">{children}</div>
    <div className="section-end" aria-hidden="true"><span/><StarFour size={14} weight="fill"/><span/></div>
  </div>;
}
