# Release checklist for Modsent

This is the source repository for the published `@thrasherflu/modsent` package. Version `3.0.0-rc.1` was published under `next`. The next prerelease `3.0.0-rc.2` updates the GitHub repository metadata and documentation. Keep `discord-filter` functional during migration.

1. Confirm that the publisher can publish under the `@thrasherflu` npm scope using `npm whoami`. The unscoped name `modsent` was rejected by npm as too similar to `moment` (E403), so keep the scoped name.
2. Use the npm account that controls `@thrasherflu`. Enable two-factor authentication or configure npm Trusted Publishing for this repository. Do not commit npm tokens.
3. Verify the source branch and build: `npm ci && npm run typecheck && npm run lint && npm test && npm run build`.
4. Run `npm pack --dry-run` and inspect the tarball; ensure `dist`, typings, README, license, changelog and `docs` are included.
5. Check the CI framework-compatibility and package-installation smoke tests.
6. Publish the first prerelease under a non-default dist-tag: `npm publish --access public --tag next`. Do **not** publish the prerelease as the `latest` dist-tag.
7. After publishing version `3.0.0-rc.2`, in a new consumer app verify `npm install @thrasherflu/modsent@next` and test all four entrypoints: `@thrasherflu/modsent`, `@thrasherflu/modsent/discordjs`, `@thrasherflu/modsent/grammy`, `@thrasherflu/modsent/telegraf`.
8. Update the old `discord-filter` repository README with a nonbreaking, clearly labeled link to the published Modsent prerelease. Preserve original installation and API documentation.
9. Deprecate the old npm package only after a stable Modsent release has been tested and users have a documented migration path. Do not republish `3.0.0-rc.1`: an npm version is immutable.
10. Before promoting a stable version to `latest`, recheck `npm dist-tag ls @thrasherflu/modsent` and verify that its version matches the intended release.

GitHub Actions CI validates the codebase, but does **not** publish npm artifacts or claim the package name. A publisher with appropriate npm access is required.
