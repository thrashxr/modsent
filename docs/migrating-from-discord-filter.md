# Migrating from discord-filter to Modsent

The existing `discord-filter` package remains available and functional. Modsent is a **separate npm package**, not an in-place rename. The new package is currently a release candidate.

## 1. Install the prerelease explicitly

```sh
npm install @thrasherflu/modsent@next
```

After validating your integration, remove the old dependency:

```sh
npm uninstall discord-filter
```

For a gradual migration, keep both packages installed until your tests pass.

## 2. Change imports

```ts
// Before
import { Filter } from 'discord-filter';

// After
import { Filter } from '@thrasherflu/modsent';
```

CommonJS:

```js
const { Filter } = require('@thrasherflu/modsent');
```

The `new Filter()`, `check(text)`, `checkAll(text)`, `addWord`, `removeWord`, `addLink` and `addInvite` interfaces remain available.

## 3. Update mutable list access

The `words`, `links`, `invites` and legacy `ads` getters now return a copy of the list, not the underlying mutable array. Replace direct array edits:

```ts
// Old behavior: mutating internal arrays directly is not reliable.
filter.words.push('customword');

// Supported API:
filter.addWord('customword');
filter.removeWord('customword');
```

## 4. Check category changes from earlier versions

Since `discord-filter` v2, results distinguish `profanity`, `invite` and `link`. Any v1 code that checked for `type === 'ad'` must be updated:

```ts
const result = filter.check(text);
if (result.match && (result.type === 'link' || result.type === 'invite')) {
  // Respond to disallowed links here.
}
```

For builtin profanity dictionaries, Modsent defaults to Turkish and English. To select one language:

```ts
const filter = new Filter({ languages: ['en'] });
```

## 5. Optional framework adapters

The text filtering core still works without any framework integration. To automatically delete matching messages, opt in to a framework adapter.

```ts
import { Filter } from '@thrasherflu/modsent';
import { createDiscordModerator } from '@thrasherflu/modsent/discordjs';

const filter = new Filter();
client.on('messageCreate', createDiscordModerator({
  filter,
  categories: ['profanity', 'invite'],
  onError: (error) => console.error(error),
}));
```

Adapters are also available for `@thrasherflu/modsent/grammy` and `@thrasherflu/modsent/telegraf`. See [the README](../README.md) for complete setups.

## 6. Test behavior before rollout

- Verify any allowlists and custom dictionaries that matter to your community.
- Test normal links, Discord invites, obfuscated messages and false-positive cases.
- Check permission failure behavior before enabling automatic deletions.
- Ensure your bot has the necessary message access intents or administrator permissions.

Because the migration is opt-in, you do **not** need to update running bots immediately.
