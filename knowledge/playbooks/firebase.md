---
type: playbook
title: The Equal Lens Firebase project
description: the-equal-lens is the one Firebase project for every Equal Lens app. What is on it, which app owns which database node, how the one ruleset is built and deployed, and how a new app joins.
plane_issues:
  - THEEQ-56 https://app.plane.so/the-equal-lens/projects/131d7f73-411c-4a57-a1d3-3147617b2de9/issues/b3bc73f9-40cc-4e3a-9bc6-2cd620c5e91e
  - BIAS-51 https://app.plane.so/the-equal-lens/projects/8471aa75-1701-46fc-9b61-ff150a1da516/issues/18b3247a-4337-4c23-a6ae-7150b2296a4f
  - BIAS-52 https://app.plane.so/the-equal-lens/projects/8471aa75-1701-46fc-9b61-ff150a1da516/issues/0501dfe7-fb84-4693-9168-58cbc5de8271
  - KEEP-57 https://app.plane.so/the-equal-lens/projects/65e7895a-75a2-456d-ba3c-03cade339b37/issues/5bcf33b2-4a0c-48f7-8a9f-6de2b5e2fbb6
  - SQAR-15 https://app.plane.so/the-equal-lens/projects/baaf5ebc-8c50-4cc2-bc9d-74029a950ad8/issues/d1258ce2-9519-4fff-a51c-532616e444af
---

# The Equal Lens Firebase project

**Every Equal Lens app that needs Firebase uses one project, `the-equal-lens`** (the owner,
3 October 2026): Spot the Stereotype, The Keepers, Surface Quest, Nivel, SwipeEd and any
app after them. Nothing of The Equal Lens goes in another Firebase project.

## 1. The project

| Thing | Value |
|---|---|
| Project | `the-equal-lens`, number `292556509102` |
| Plan | Spark, the free plan (the owner: one shared database, no card) |
| Account | `priyanshu.jain@theequallens.com`. The gmail account the CLI uses by default cannot see the project. |
| Realtime Database | `https://the-equal-lens-default-rtdb.asia-southeast1.firebasedatabase.app`, Singapore |
| Sign-in | Anonymous only, for Spot. Any other provider is an owner decision: the games promise no accounts. |
| Web API key | One for the project, shared by every web app. It ships in every page and is not a secret; the rules are what protect the data. |

## 2. Who uses it

| App | Repo | Uses | Database nodes | Firebase app | Status |
|---|---|---|---|---|---|
| Spot the Stereotype | `spot-the-stereotype` | Realtime Database, Anonymous sign-in | `spot`, `spot-keys`, `spot-anytime` | web `1:292556509102:web:af6f8a9a1b3754c185823f` | Live, 3 October 2026 (BIAS-51) |
| The Keepers | `the-keepers` | Realtime Database | `rooms` | web `1:292556509102:web:a75e536c9e267c4a85823f` | Ready on branch `keep-57-the-equal-lens`; live once Vercel's values change (KEEP-57) |
| Surface Quest | `surface-quest-ar` | App Distribution | none | android `1:292556509102:android:b3c2c3fd0599e19285823f` | Moves at the next build; `distribute.sh` is on `praxis-2ffa8` until then (SQAR-15) |
| Nivel | `parity-tracker` | nothing | none | none | No backend: its data is built into the app |
| SwipeEd | `swipeed-equal-lens` | nothing | none | none | No backend: progress stays on the device |

The website (`the-equal-lens` repo's Next.js app) uses Sanity and Resend, not Firebase.
The registry the rules build reads is `firebase/apps.json` in this repo; keep it and this
table in step.

## 3. One database, one ruleset, built from pieces

A Realtime Database has **one rules file**, and a deploy replaces all of it. So no app
deploys rules:

- **Each app keeps its piece** as `database.rules.json` in its own repo, naming only the
  top-level nodes registered to it, and tests it there (Spot: `pnpm rules`, `pnpm e2e`).
  Each app repo's `firebase.json` runs a `deploy-guard.sh` that refuses every rules deploy.
- **`firebase/` in this repo builds the whole** (`build-rules.mjs`): it takes every piece
  from its repo's `main` on GitHub and refuses, listing every problem at once, a grant at
  the root, a node not registered to the app, a node two apps claim, and a registered node
  a piece is missing.
- **Deploying** runs the build itself first, so what goes live is always what each app has
  merged, and its guard refuses any project but `the-equal-lens`:

```bash
cd ~/"The Equal Lens"/firebase && firebase deploy --only database --project the-equal-lens
```

- **Checking** (the merge's refusals, and the built ruleset loaded into the emulator):

```bash
cd ~/"The Equal Lens"/firebase && node build-rules.mjs && PATH="/opt/homebrew/opt/openjdk/bin:$PATH" firebase emulators:exec --only database --project demo-equal-lens 'node check.mjs'
```

`node build-rules.mjs --local` builds from the `~/<repo>` checkouts to try a change before
it is merged; the deploy never uses it. Commit `firebase/database.rules.json` after a deploy,
as the record of what is live.

## 4. A new app joining

1. Register it: `firebase apps:create web <name> --project the-equal-lens` (or `android`,
   `ios`), from a folder whose `firebase.json` has `firebase login:use
   priyanshu.jain@theequallens.com` set; `firebase apps:sdkconfig` gives its values.
2. Name its nodes after the app (`swipeed-…`, `nivel-…`), never a bare word: `rooms` is The
   Keepers' only because it was there first.
3. Write its piece, naming only those nodes, test it in its repo against the emulator, and
   add the refusing `deploy-guard.sh` to its `firebase.json`.
4. Add it to `firebase/apps.json` and section 2 here, build, check, and deploy from
   `firebase/` with the owner's go-ahead.
5. Put the web app's values in the app's hosting variables (Vercel, all three environments),
   redeploy it, and test it live.

## 5. The free plan's limits

All apps share **100 simultaneous connections**, 1 GB stored and 10 GB downloaded a month.
A live Spot night or Keepers table holds a connection per device; anytime play and a
static app hold none. When a public launch could pass 100 at once (Spot's anytime
decision 7), the answer is Blaze with a database instance per app, each with its own
rules file, and a budget alert set at the same time.

## 6. The CLI, and what has bitten

- **Name the project on every command** (`--project the-equal-lens`). The home folder has a
  `firebase use praxis-2ffa8`, and a `firebase use` in a parent folder outranks a repo's
  `.firebaserc`: it once sent Spot's deploy to praxis, refused only because the account
  could not see it.
- **`firebase login:use` only sets a folder's account where the folder has a
  `firebase.json`.** Run anywhere else, it changes the global default for every folder. It
  did once, and was set back to the gmail account. Pass `--account` instead.
- The folders set to the theequallens.com account and to `the-equal-lens`:
  `spot-the-stereotype`, `the-keepers`, `The Equal Lens/firebase`. The old worktree
  `the-keepers-worktrees/web` is still set to `praxis-2ffa8`.

## 7. What is left on `praxis-2ffa8`

`praxis-2ffa8` is Praxis's own project. What The Equal Lens still has there: Spot's old
`spot` and `spot-anytime` rules (unused since the move, with the anytime counts gathered
that morning), The Keepers' `rooms` until KEEP-57 goes live, and Surface Quest's Android app
until its next build. Once those three have moved, nothing of The Equal Lens is left there,
and Praxis's rules can drop the Equal Lens nodes.
