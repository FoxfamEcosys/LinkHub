import test from 'node:test';
import assert from 'node:assert/strict';
import { contentSchema, initialContent } from '../src/content.ts';

test('the initial site content satisfies the editor contract', () => {
  assert.equal(contentSchema.safeParse(initialContent).success, true);
});
test('stored links cannot contain script or insecure protocols', () => {
  for (const url of ['javascript:alert(1)', 'data:text/html,hello', 'http://example.com']) {
    assert.equal(contentSchema.safeParse({...initialContent, links: [{id:'bad',label:'Bad',url,hidden:false}]}).success, false);
  }
});
test('imported drafts reject duplicate item IDs', () => {
  assert.equal(contentSchema.safeParse({...initialContent, links: [initialContent.links[0],initialContent.links[0]]}).success, false);
});
test('updates require real calendar dates, including leap years', () => {
  const post = {id:'test',title:'An update',body:'Hello',pinned:false};
  for (const date of ['2026-02-29','2026-04-31','2026-99-01','invalid']) {
    assert.equal(contentSchema.safeParse({...initialContent, updates:[{...post,date}]}).success, false);
  }
  assert.equal(contentSchema.safeParse({...initialContent, updates:[{...post,date:'2028-02-29'}]}).success, true);
});
test('splash image paths and positioning are constrained', () => {
  assert.equal(contentSchema.safeParse({...initialContent,splashImage:'file:///private/example.png'}).success,false);
  assert.equal(contentSchema.safeParse({...initialContent,imagePosition:101}).success,false);
});
