# Sanity CMS setup

Team members, jobs, and blog posts are editable in Sanity. Until it's configured,
the site reads the in-repo files under `knowledge/` (nothing breaks). Once the env
vars below are set, the site reads from Sanity automatically.

The editor UI (Sanity Studio) is **hosted free by Sanity** at
`https://<your-name>.sanity.studio` (deployed from the config in this repo). It's
run standalone rather than embedded, because the Studio doesn't yet build under
Next.js 16's Turbopack, so this keeps the site fast and the Studio reliable. We can
revisit embedding it at `/studio` later if that compatibility lands.

## One-time setup (you do this)

1. **Create a free Sanity project**
   - Sign up at https://www.sanity.io (the Free plan covers up to 20 editors).
   - Create a project and a dataset named **`production`** (public).
   - Note the **Project ID** (in project settings; not secret).

2. **Add environment variables**: locally copy `.env.local.example` → `.env.local`,
   and add the same in **Vercel → Settings → Environment Variables** (Production + Preview):
   ```
   NEXT_PUBLIC_SANITY_PROJECT_ID=<your project id>
   NEXT_PUBLIC_SANITY_DATASET=production
   NEXT_PUBLIC_SANITY_API_VERSION=2024-10-01
   SANITY_REVALIDATE_SECRET=<any long random string>
   ```
   Redeploy after adding them. (The site now reads from Sanity.)

3. **Deploy the Studio** (the editor UI), from the repo root:
   ```
   npx sanity login        # sign in
   npx sanity deploy       # pick a name -> https://<name>.sanity.studio
   ```
   Run `npx sanity dev` to preview the Studio locally first (http://localhost:3333).

4. **Add the publish webhook** (fast updates)
   - In Sanity → API → Webhooks → Create:
     - URL: `https://the-equal-lens.vercel.app/api/revalidate`
     - Trigger on: Create, Update, Delete · HTTP method: POST
     - Secret: the same value as `SANITY_REVALIDATE_SECRET`
   - Without the webhook, content still refreshes automatically within ~60s.

5. **Add the team and start editing**
   - Open your `<name>.sanity.studio`, invite teammates (Members in project settings).
   - Create Team members, Jobs, and Blog posts. Set Blog posts to **Published** and
     pick an **Audience** (Kids / Adult). Drafts stay hidden.

## Migrating the existing content
The current samples live in `knowledge/team`, `knowledge/jobs`, `knowledge/blog`.
Recreate them in the Studio (there are only a few). Once Sanity has the content and
the env vars are set, the file versions are ignored and can be deleted later.

## Notes
- Roles: the Free plan has Administrator + Viewer only. Editors need Administrator
  (full access). The restricted "Editor" role is on the paid Growth plan.
- The pages render the exact same shapes whether content comes from Sanity or the
  files, so nothing on the site changes visually.
