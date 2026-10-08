# Link audit — October 7, 2026

Source: https://verivt.stream/links. Redirect destinations were resolved, then pages inspected where needed. HTTP 200 alone was not treated as proof of a valid profile.

| Item | Resolved destination | Result | Build action |
|---|---|---|---|
| Twitch | https://www.twitch.tv/veri | Owner confirmed replacement; browser loads Veri, Verified Partner, current creator bio and videos. Old verithevixen destination unavailable. | Direct URL restored in radial menu and splash CTA. |
| X | https://x.com/veri_vt | Owner confirmed replacement; browser loads Veri @veri_vt profile, creator bio and posts. Old verithevixen destination unavailable. | Direct URL restored with X name and icon. |
| Patreon | https://www.patreon.com/VeriVT | Creator metadata identifies The Forsaken Sanctuary and Fallen Tenko. | Retained. |
| TikTok | https://www.tiktok.com/@verivt | Profile identifies Veri and links back to verivt.stream. | Retained. |
| YouTube | https://www.youtube.com/channel/UCVOqXCpZ6DWLFv5K14sVGGQ?sub_confirmation=1 | Channel indexed as Veri; original redirect reaches channel successfully. | Retained. |
| Discord | https://discord.com/invite/YWNdPSnxqm | Browser shows valid invitation by verivt to The Forsaken Shrine. | Retained. |
| Throne | https://throne.com/verivt | Initial HTTP rate limit; browser loads verified Veri profile and Fallen Tenko bio. | Retained. |
| Tip | https://streamelements.com/veri/tip | Browser title “Veri's tipping page”; sign-in required. Payment flow not tested. | Retained. |
| Email | mailto:veri@verivt.stream | Valid mailto syntax; mailbox delivery unverified, no message sent. | Retained. |
| TwitchCon 2025 | https://www.twitchcon.com/ | Generic event homepage, not a current Veri appearance or 2025 detail page. | Hidden, retained in editor. |

No shortlink service configuration was changed. The historical event remains hidden and editable. Twitch and X replacements were confirmed by the owner and checked in the browser. No new handles were guessed. This audit applies to local defaults; an independently saved Supabase content record would need the same corrections through the owner editor after configuration.
