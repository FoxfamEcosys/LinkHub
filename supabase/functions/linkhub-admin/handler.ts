import { z } from 'zod';
import { contentSchema, type SiteContent } from '../_shared/content.ts';

export interface AdminRepository {
  isOwner(token: string): Promise<boolean>;
  load(): Promise<{ draft: unknown; revision: number }>;
  write(content: SiteContent, revision: number, publish: boolean): Promise<number | null>;
  upload(bytes: Uint8Array, mime: string, extension: string): Promise<string>;
}
const requestSchema = z.discriminatedUnion('action', [
  z.object({ action: z.literal('load') }),
  z.object({ action: z.enum(['save', 'publish']), revision: z.number().int().min(0), content: contentSchema }),
]);
const MAX_IMAGE = 15 * 1024 * 1024;
async function boundedBody(request: Request, limit: number): Promise<Uint8Array> {
  const reader = request.body?.getReader();
  if (!reader) return new Uint8Array();
  const chunks: Uint8Array[] = [];
  let length = 0;
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    length += value.byteLength;
    if (length > limit) { await reader.cancel(); throw new RangeError('Request too large'); }
    chunks.push(value);
  }
  const result = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) { result.set(chunk, offset); offset += chunk.length; }
  return result;
}
function imageFormat(bytes: Uint8Array): {mime:string;extension:string} | null {
  if ([137,80,78,71,13,10,26,10].every((byte,i)=>bytes[i]===byte)) return {mime:'image/png',extension:'png'};
  if (bytes[0]===255 && bytes[1]===216 && bytes[2]===255) return {mime:'image/jpeg',extension:'jpg'};
  const decoder = new TextDecoder();
  if (decoder.decode(bytes.slice(0,4))==='RIFF' && decoder.decode(bytes.slice(8,12))==='WEBP') return {mime:'image/webp',extension:'webp'};
  return null;
}
export function createAdminHandler(repository: AdminRepository, allowedOrigins: string[]) {
  return async (request: Request): Promise<Response> => {
    const origin = request.headers.get('origin');
    const cors = {
      'Access-Control-Allow-Origin': origin && allowedOrigins.includes(origin) ? origin : allowedOrigins[0] ?? '',
      'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Vary': 'Origin',
      'Cache-Control': 'no-store',
    };
    const reply = (status: number, value: unknown) => new Response(JSON.stringify(value), {status,headers:{...cors,'Content-Type':'application/json'}});
    if (!allowedOrigins.length || (origin && !allowedOrigins.includes(origin))) return reply(403,{error:'This site is not allowed.'});
    if (request.method==='OPTIONS') return new Response(null,{status:204,headers:cors});
    if (request.method!=='POST') return reply(405,{error:'Use POST for editor actions.'});
    const token = request.headers.get('authorization')?.match(/^Bearer (.+)$/i)?.[1];
    if (!token) return reply(401,{error:'Sign in to edit this site.'});
    try {
      if (!await repository.isOwner(token)) return reply(403,{error:'This account is not a LinkHub owner.'});
      const mime = request.headers.get('content-type')?.split(';')[0];
      if (mime?.startsWith('image/')) {
        const bytes = await boundedBody(request,MAX_IMAGE);
        const format = imageFormat(bytes);
        if (!format || format.mime!==mime) return reply(415,{error:'Choose a valid PNG, JPEG or WebP.'});
        return reply(201,{url:await repository.upload(bytes,format.mime,format.extension)});
      }
      if (mime!=='application/json') return reply(415,{error:'Use JSON for content changes.'});
      const bytes = await boundedBody(request,512*1024);
      let raw: unknown;
      try { raw=JSON.parse(new TextDecoder().decode(bytes)); } catch { return reply(400,{error:'The editor request could not be read.'}); }
      const parsed=requestSchema.safeParse(raw);
      if (!parsed.success) return reply(400,{error:'Check the content fields and try again.'});
      const input=parsed.data;
      if (input.action==='load') return reply(200,await repository.load());
      if (input.content.splashImage.startsWith('blob:')) return reply(400,{error:'Upload the artwork before saving or publishing.'});
      const revision=await repository.write(input.content,input.revision,input.action==='publish');
      if (revision===null) return reply(409,{error:'A newer draft exists. Restore the saved draft before trying again.'});
      return reply(200,{revision});
    } catch (error) {
      if (error instanceof RangeError) return reply(413,{error:'This file or content is too large.'});
      return reply(500,{error:'The shrine could not save that just now. Your edits are still in the editor.'});
    }
  };
}
