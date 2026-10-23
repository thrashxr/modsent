# Modsent v3.0.0 release checklist

The code in this repository is being prepared for the first **stable** `@thrasherflu/modsent@3.0.0` release. This checklist does not publish anything by itself.

## Verified before the stable release

- Automated CI: 190 unit tests, TypeScript, lint, ESM/CJS build, packed-package installation, and type-compatibility checks against real Discord.js, grammY and Telegraf declarations on Node.js 20 and 22.
- Manual smoke tests in dedicated Discord and Telegram test environments (reported October 23, 2026): profanity, obfuscation, ordinary URLs, Discord invites, normal-message false positives, deletion, and Discord/grammY permissions and error callbacks. See [manual live verification](live-validation.md) for coverage and limitations.
- The old `discord-filter` package is still maintained separately and is not deprecated.

## Maintainer release steps

1. Confirm GitHub CI is green for the exact stable commit and review any unresolved dependency/security pull requests separately.
2. In a fresh checkout of `thrashxr/modsent` at the verified commit:
   ```sh
   npm ci
   npm run typecheck
   npm run lint
   npm test
   npm run build
   npm pack --dry-run
   ```
3. Verify `npm pkg get name version` is `@thrasherflu/modsent` / `3.0.0`. Run `npm audit --omit=dev` to check shipped dependencies. Do not run unreviewed `npm audit fix --force`.
4. Publish the stable release using the npm account authorized for `@thrasherflu`:
   ```sh
   npm publish --access public --tag latest
   ```
5. Confirm distribution tags and installed entrypoints from the npm registry:
   ```sh
   npm dist-tag ls @thrasherflu/modsent
   npm view @thrasherflu/modsent@latest version
   ```
   Expect `latest: 3.0.0`. Keep `next: 3.0.0-rc.2` until a future prerelease replaces it; do not automatically move prerelease tags.
6. In a fresh consumer project, install `@thrasherflu/modsent@3.0.0` and load `@thrasherflu/modsent`, `/discordjs`, `/grammy` and `/telegraf`. Confirm ESM and CommonJS entrypoints.
7. After npm propagation and smoke tests, replace the README's prerelease status text with an exact stable published claim and update installation to `npm install @thrasherflu/modsent` in a follow-up commit. Optionally tag the verified stable commit `v3.0.0` and create GitHub release notes.
8. Leave the `discord-filter` package installable for existing users. Deprecation is a separate decision, not part of publishing `3.0.0`.

## Scope and limitations

The core has no runtime npm dependencies. Manual checks cover the main moderation flows but do not exhaustively test all message types, rate-limit behavior, bot deployments, or platform policy changes. Review false positives and permissions in the target community before deploying with deletion enabled.
