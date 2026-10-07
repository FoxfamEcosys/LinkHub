import { z } from 'zod';
const calendarDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(value => {
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}, 'Choose a valid calendar date.');
const itemId = z.string().min(1).max(100);
const webUrl = z.string().url().refine(value => ['https:', 'mailto:'].includes(new URL(value).protocol), 'Use an HTTPS or email link.');
export const contentSchema = z.object({
  tagline: z.string().trim().min(1).max(180),
  intro: z.string().trim().min(1).max(800),
  about: z.string().trim().min(1).max(6000),
  splashImage: z.string().refine(value => value === '/images/veri-splash-original.png' || value.startsWith('blob:') || (value.startsWith('https://') && URL.canParse(value))),
  imagePosition: z.number().min(0).max(100),
  links: z.array(z.object({id:itemId,label:z.string().trim().min(1).max(80),url:webUrl,hidden:z.boolean()})).max(40),
  credits: z.string().max(6000),
  rules: z.string().max(6000),
  merchUrl: z.union([z.literal(''),webUrl]),
  updates: z.array(z.object({id:itemId,title:z.string().trim().min(1).max(160),body:z.string().max(4000),date:calendarDate,pinned:z.boolean()})).max(100)
}).superRefine((content, context) => {
  for (const key of ['links', 'updates'] as const) {
    const ids = new Set<string>();
    content[key].forEach((item, index) => {
      if (ids.has(item.id)) context.addIssue({ code: 'custom', path: [key, index, 'id'], message: 'Each item must have a unique ID.' });
      ids.add(item.id);
    });
  }
});
export type SiteContent = z.infer<typeof contentSchema>;
export const initialContent: SiteContent = {
  tagline:'Come for the gameplay. Stay for the chaos.',
  intro:'Gameplay, witty banter, entirely unintentional horror comedy, and the 2am talks that make you feel a little more at home.',
  about:'Come for the (often interrupted) gameplay. Stay for the witty banter, entirely unintentional horror comedy, and the 2am soul-healing talks that leave you feeling an odd yet satisfying mix of confused, forgiven, and relieved.',
  splashImage:'/images/veri-splash-original.png',imagePosition:50,
  links:[{id:'twitch',label:'Twitch',url:'https://links.verithevixen.com/twitch',hidden:false},{id:'discord',label:'Discord',url:'https://links.verithevixen.com/discord',hidden:false},{id:'email',label:'Email',url:'mailto:veri@verivt.stream',hidden:false}],
  credits:'',rules:'',merchUrl:'',updates:[]
};
