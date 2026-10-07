import { z } from 'zod';
import { contentSchema } from '../_shared/content.ts';
import { createClient } from '@supabase/supabase-js';
import { createAdminHandler } from './handler.ts';
const admin=createClient(Deno.env.get('SUPABASE_URL')!,Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,{
  auth:{persistSession:false,autoRefreshToken:false},
});
Deno.serve(createAdminHandler({
  async isOwner(token) {
    const {data,error}=await admin.auth.getUser(token);
    if (error || !data.user) return false;
    const result=await admin.from('linkhub_owners').select('user_id').eq('user_id',data.user.id).maybeSingle();
    if (result.error) throw new Error('Owner lookup failed');
    return Boolean(result.data);
  },
  async load() {
    const {data,error}=await admin.from('linkhub_state').select('draft,revision').eq('id',true).single();
    if (error) throw new Error('Draft lookup failed');
    return z.object({draft:contentSchema.nullable(),revision:z.number().int().nonnegative()}).parse(data);
  },
  async write(content,revision,publish) {
    const {data,error}=await admin.rpc('linkhub_write',{p_content:content,p_revision:revision,p_publish:publish});
    if (error) throw new Error('Content write failed');
    return z.number().int().nonnegative().nullable().parse(data);
  },
  async upload(bytes,mime,extension) {
    const path=`originals/${crypto.randomUUID()}.${extension}`;
    const {error}=await admin.storage.from('linkhub-artwork').upload(path,bytes,{contentType:mime,upsert:false});
    if (error) throw new Error('Artwork upload failed');
    return admin.storage.from('linkhub-artwork').getPublicUrl(path).data.publicUrl;
  },
},(Deno.env.get('LINKHUB_ALLOWED_ORIGINS')??'').split(',').map(value=>value.trim()).filter(Boolean)));
