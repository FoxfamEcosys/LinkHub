import test from 'node:test';
import assert from 'node:assert/strict';
import { createAdminHandler } from '../supabase/functions/linkhub-admin/handler.ts';
import { initialContent } from '../src/content.ts';
const origin='https://verivt.stream';
function setup(overrides={}) {
  const calls=[];
  const repository={
    isOwner:async token=>token==='owner-token',
    load:async()=>({draft:initialContent,revision:2}),
    write:async(...args)=>{calls.push(args);return 3;},
    upload:async(bytes)=>{calls.push(bytes);return 'https://example.com/art.png';},
    ...overrides,
  };
  return {handler:createAdminHandler(repository,[origin]),calls};
}
function request(body,token='owner-token',site=origin) {
  return new Request('https://backend.example.com/linkhub-admin',{method:'POST',headers:{origin:site,'content-type':'application/json',...(token?{authorization:`Bearer ${token}`}:{})},body:JSON.stringify(body)});
}
test('anonymous and non-owner requests cannot load or mutate drafts',async()=>{
  const {handler,calls}=setup();
  assert.equal((await handler(request({action:'load'},''))).status,401);
  assert.equal((await handler(request({action:'publish',content:initialContent,revision:2},'visitor'))).status,403);
  assert.equal(calls.length,0);
});
test('unexpected origins and methods are rejected',async()=>{
  const {handler}=setup();
  assert.equal((await handler(request({action:'load'},'owner-token','https://other.example'))).status,403);
  assert.equal((await handler(new Request('https://backend.example.com'))).status,405);
});
test('server validates content and refuses temporary image URLs',async()=>{
  const {handler,calls}=setup();
  for(const content of [{...initialContent,tagline:''},{...initialContent,splashImage:'blob:temporary'}]) {
    assert.equal((await handler(request({action:'publish',content,revision:2}))).status,400);
  }
  assert.equal(calls.length,0);
});
test('draft saves and publishing have explicit separate intent',async()=>{
  const {handler,calls}=setup();
  const saved=await handler(request({action:'save',content:initialContent,revision:2}));
  assert.deepEqual(await saved.json(),{revision:3});
  assert.equal(calls[0][2],false);
  await handler(request({action:'publish',content:initialContent,revision:3}));
  assert.equal(calls[1][2],true);
});
test('stale editor revisions return a conflict',async()=>{
  const {handler}=setup({write:async()=>null});
  assert.equal((await handler(request({action:'save',content:initialContent,revision:0}))).status,409);
});
test('storage errors do not expose raw server details',async()=>{
  const {handler}=setup({load:async()=>{throw new Error('private backend details');}});
  const response=await handler(request({action:'load'}));
  assert.equal(response.status,500);
  assert.doesNotMatch(await response.text(),/private backend details/);
});
test('invalid image types and oversized bodies are rejected',async()=>{
  const {handler,calls}=setup();
  for(const [body,status] of [[new Uint8Array([1,2,3]),415],[new Uint8Array(15*1024*1024+1),413]]) {
    const response=await handler(new Request('https://backend.example.com',{method:'POST',headers:{origin,authorization:'Bearer owner-token','content-type':'image/png'},body}));
    assert.equal(response.status,status);
  }
  assert.equal(calls.length,0);
});
test('artwork bytes reach storage without alteration',async()=>{
  const {handler,calls}=setup();
  const bytes=new Uint8Array([137,80,78,71,13,10,26,10,1,2,3,4]);
  const response=await handler(new Request('https://backend.example.com',{method:'POST',headers:{origin,authorization:'Bearer owner-token','content-type':'image/png'},body:bytes}));
  assert.equal(response.status,201);
  assert.deepEqual(calls[0],bytes);
});
