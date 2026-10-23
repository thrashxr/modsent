# Releasing Modsent

## Current stable release

`@thrasherflu/modsent@3.0.0` was published to npm under the `latest` dist-tag on October 23, 2026. This is the canonical source repository: [thrashxr/modsent](https://github.com/thrashxr/modsent).

Verify registry metadata:

```sh
npm view @thrasherflu/modsent@latest version
npm dist-tag ls @thrasherflu/modsent
```

The expected current stable version is `3.0.0`. The previous release candidate `3.0.0-rc.2` remains available under the `next` tag unless the maintainer explicitly changes it.

## Verified before v3.0.0

- 190 unit tests, TypeScript checking, lint, ESM/CJS build, packed npm package consumer tests and real Discord.js, grammY and Telegraf type checks.
- User-operated live smoke tests in isolated Discord/Telegram test environments on October 23, 2026. See [manual live verification](live-validation.md).
- Dependency-security remediation subsequently passed full `npm audit` with zero findings, including development dependencies, and CI on Node.js 22 and 24.
- The prior `discord-filter` npm package remains independent and is not deprecated.

## Checklist for the next release

1. Work with Node.js 22.12+ for source development and builds. The published JavaScript library targets Node.js 18+.
2. Review outstanding dependency/security advisories and confirm all CI jobs are green for the exact intended commit.
3. Run in a clean checkout:

   ```sh
   npm ci
   npm run typecheck
   npm run lint
   npm test
   npm run build
   npm audit --audit-level=low
   npm pack --dry-run
   ```

4. Increment `package.json` and `package-lock.json` together; npm versions are immutable once published. Ensure the package tarball includes the expected `dist` artifacts, type declarations, README and license.
5. For stable versions publish using `npm publish --access public --tag latest`. For prereleases use `npm publish --access public --tag next`. Do not publish the same version twice.
6. Verify the dist-tag and installation in a fresh consumer project with all four entrypoints: `@thrasherflu/modsent`, `/discordjs`, `/grammy`, and `/telegraf`, for ESM and CommonJS.
7. Update README, changelog and release notes with confirmed publication details. Consider creating a GitHub release for the corresponding commit.

Existing `discord-filter` consumers are not required to migrate; deprecation is a separate maintainer decision.

## Limitations

Manual smoke tests do not exhaustively cover large workloads, Telegram permissions across all group types, Discord partial messages or every possible false-positive case. Use staged rollout and review moderation policies for new deployments.
