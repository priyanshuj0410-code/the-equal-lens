#!/usr/bin/env node
/**
 * The shared ruleset's check (knowledge/playbooks/firebase.md). It holds the
 * merge's refusals on made-up pieces, then loads the built
 * `database.rules.json` into the database emulator, never a real database,
 * and holds that the emulator runs exactly that ruleset and that nothing it
 * does not name can be read or written. Each app's own behaviour is tested in
 * its own repo, on its own piece.
 *
 *   firebase emulators:exec --only database --project demo-equal-lens 'node check.mjs'
 */
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { merge, stripComments } from './build-rules.mjs'

const here = dirname(fileURLToPath(import.meta.url))
let failed = 0
const ok = (what, cond, got) => {
  console.log(`${cond ? 'ok  ' : 'FAIL'} ${what}${cond || got === undefined ? '' : ` (got ${JSON.stringify(got)})`}`)
  if (!cond) failed += 1
}

/* ---- the merge, on made-up pieces ---- */
{
  const a = { name: 'A', nodes: ['a-rooms'] }
  const b = { name: 'B', nodes: ['b-rooms'] }
  const piece = (rules) => JSON.stringify({ rules })
  const good = merge([a, b], ['{ /* a comment */ "rules": { "a-rooms": { ".read": "auth != null" } } } // and one more', piece({ 'b-rooms': {} })])
  ok('two apps’ pieces merge into one ruleset, comments and all', good.problems.length === 0 && Object.keys(good.rules).join() === 'a-rooms,b-rooms', good)
  ok('a rule that holds a slash in a string keeps it', stripComments('{"x": "a // b /* c */"}') === '{"x": "a // b /* c */"}')
  ok('a grant at the root is refused', merge([a], [piece({ '.read': true, 'a-rooms': {} })]).problems.some((p) => p.includes('root')))
  ok('a node not registered to the app is refused', merge([a], [piece({ 'a-rooms': {}, users: {} })]).problems.some((p) => p.includes('users')))
  ok('a node two apps claim is refused', merge([a, { ...b, nodes: ['a-rooms'] }], [piece({ 'a-rooms': {} }), piece({ 'a-rooms': {} })]).problems.some((p) => p.includes('already')))
  ok('a registered node missing from a piece is refused', merge([a], [piece({})]).problems.some((p) => p.includes('not in its rules')))
  ok('a piece that is not JSON is refused', merge([a], ['{ "rules": ']).problems.length === 1)
}

/* ---- the built ruleset, in the emulator ---- */
const HOST = process.env.FIREBASE_DATABASE_EMULATOR_HOST
const PROJECT = process.env.GCLOUD_PROJECT ?? ''
if (HOST && PROJECT.startsWith('demo-')) {
  const ns = `${PROJECT}-default-rtdb`
  const built = JSON.parse(stripComments(readFileSync(join(here, 'database.rules.json'), 'utf8')))
  const { apps } = JSON.parse(readFileSync(join(here, 'apps.json'), 'utf8'))
  const get = async (path, owner = false) => {
    const res = await fetch(`http://${HOST}/${path}.json?ns=${ns}`, owner ? { headers: { authorization: 'Bearer owner' } } : {})
    return { status: res.status, text: await res.text() }
  }
  const loaded = await get('.settings/rules', true)
  ok('the emulator runs exactly the built ruleset', JSON.stringify(JSON.parse(stripComments(loaded.text))) === JSON.stringify(built), loaded.status)
  ok('it names every registered node and nothing else',
    Object.keys(built.rules).sort().join() === apps.flatMap((a) => a.nodes).sort().join(), Object.keys(built.rules))
  const stray = await fetch(`http://${HOST}/someone-else/x.json?ns=${ns}`, { method: 'PUT', body: '1' })
  ok('a node no app registers cannot be written', !stray.ok, stray.status)
  ok('and the database cannot be read whole', (await get('')).status === 401)
} else console.log('(the emulator part runs under: firebase emulators:exec --only database --project demo-equal-lens)')

if (failed) {
  console.error(`\n${failed} failed`)
  process.exit(1)
}
console.log('check: the pieces merge only as a clean union, and the database runs exactly that')
