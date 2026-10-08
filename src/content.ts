import type { SiteContent } from '../supabase/functions/_shared/content.ts';
export { contentSchema, type SiteContent } from '../supabase/functions/_shared/content.ts';
export const initialContent: SiteContent = {
  tagline:'Come for the gameplay. Stay for the chaos.',
  intro:'Gameplay, witty banter, entirely unintentional horror comedy, and the 2am talks that make you feel a little more at home.',
  about:'Come for the (often interrupted) gameplay. Stay for the witty banter, entirely unintentional horror comedy, and the 2am soul-healing talks that leave you feeling an odd yet satisfying mix of confused, forgiven, and relieved.',
  splashImage:'/images/veri-splash-original.png',imagePosition:50,
  links:[{"id": "twitch", "label": "Twitch", "url": "https://links.verithevixen.com/twitch", "hidden": false}, {"id": "twitter", "label": "Twitter", "url": "https://links.verithevixen.com/twitter", "hidden": false}, {"id": "patreon", "label": "Patreon", "url": "https://links.verithevixen.com/patreon", "hidden": false}, {"id": "tiktok", "label": "TikTok", "url": "https://links.verithevixen.com/tiktok", "hidden": false}, {"id": "youtube", "label": "YouTube", "url": "https://links.verithevixen.com/youtube", "hidden": false}, {"id": "discord", "label": "Discord", "url": "https://links.verithevixen.com/discord", "hidden": false}, {"id": "throne", "label": "Throne", "url": "https://links.verithevixen.com/throne", "hidden": false}, {"id": "tip", "label": "Tip", "url": "https://links.verithevixen.com/tip", "hidden": false}, {"id": "email", "label": "Email", "url": "mailto:veri@verivt.stream", "hidden": false}, {"id": "twitchcon", "label": "TwitchCon 2025", "url": "https://links.verivt.stream/TC2025", "hidden": false}],
  credits:'',rules:'',merchUrl:'',updates:[]
};
