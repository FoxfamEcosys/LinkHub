# LinkHub backend setup — not yet deployed

Choose the project before applying anything. The migration creates new `linkhub_*` tables, an RPC and an artwork bucket; it does not reuse Portal tables.

1. Review the target project's existing Storage policies, especially any broad policies that permit writes to all buckets. LinkHub requires `linkhub-artwork` writes to remain server-only.
2. Apply `migrations/202610070001_linkhub_content.sql` once in the chosen project.
3. Enroll the existing owner's Auth user UUID in `public.linkhub_owners`. Do not infer an owner from an email address, browser UI, or public metadata. Keep self-registration disabled for this flow. The client requests email sign-in with `shouldCreateUser: false`.
4. Set `LINKHUB_ALLOWED_ORIGINS` as an Edge Function secret containing exact comma-separated origins, such as the approved deployment URL. Add `http://127.0.0.1:5179` only if local testing is needed. The Supabase URL and service-role secret are supplied only to the function; never expose a service key to Vite.
5. Deploy `linkhub-admin` with the included config. Gateway JWT verification is disabled because the handler validates every non-OPTIONS request through `auth.getUser(token)` and the server-only owner allowlist. Do not remove that check.
6. Set `VITE_SUPABASE_URL` and the project's browser-safe anon/publishable key as `VITE_SUPABASE_ANON_KEY`. Configure the Auth site/redirect URLs to the same approved site origins and the email provider for magic-link delivery.
7. Build and deploy the frontend only after local and project-level checks pass.

## Data flow

Visitors read only `linkhub_published` through RLS. Owners call the function, which verifies identity and membership before accessing private drafts. The same Zod content contract validates requests on the server and browser. Saving advances an optimistic revision; publishing writes the private draft and public content in one database transaction. A stale revision returns HTTP 409 without overwriting newer data.

Artwork uploads are limited to 15 MiB with PNG/JPEG/WebP signature and MIME checks. The original bytes receive a unique immutable object name. The bucket is public: uploaded artwork is accessible at its URL even before its use is published. Draft text remains private. No remote URL is fetched by the function.

## Required live acceptance

- Anonymous and ordinary authenticated accounts cannot read drafts, update owners, write content, call the write RPC, or upload/overwrite/delete artwork directly.
- An enrolled owner can sign in, save a draft, reload it, upload an image, preview, then publish.
- A separate signed-out browser sees only the published version.
- Two editor tabs produce a conflict for the stale tab without losing the saved version.
- Download the uploaded image and compare its SHA-256 to the original.
- Verify the approved origin and redirect configuration, sign-out behavior, and owner removal.

Local handler tests use an injected repository. They do not prove Supabase RLS, SQL transaction behavior, Auth mail delivery, Storage policies, or a live deployment. These gates remain pending until the project is selected and configured.
