# Modsent

[![npm version](https://img.shields.io/npm/v/%40thrasherflu%2Fmodsent)](https://www.npmjs.com/package/@thrasherflu/modsent)
[![npm downloads](https://img.shields.io/npm/dm/%40thrasherflu%2Fmodsent)](https://www.npmjs.com/package/@thrasherflu/modsent)
[![CI](https://github.com/thrashxr/modsent/actions/workflows/ci.yml/badge.svg)](https://github.com/thrashxr/modsent/actions/workflows/ci.yml)
[![license](https://img.shields.io/npm/l/%40thrasherflu%2Fmodsent)](LICENSE)

Dependency-free Turkish/English profanity, link and invite filtering for Node.js. Modsent detects separator, repetition, leetspeak and Unicode homoglyph bypasses while preserving common false-positive cases.

Use the core with any application, or add the ready-to-use Discord.js, grammY and Telegraf adapters. The package has zero runtime dependencies and ships ESM, CommonJS and TypeScript declarations.

## Installation

```sh
npm install @thrasherflu/modsent
```

This installs the current stable release through npm's `latest` tag.

[View the published package](https://www.npmjs.com/package/@thrasherflu/modsent) | [Migration guide](docs/migrating-from-discord-filter.md)

## Standalone Node.js

```ts
import { Filter } from '@thrasherflu/modsent';

const filter = new Filter();

console.log(filter.check('s.a.l.a.k').type);          // profanity
console.log(filter.check('discord,gg/example').type); // invite
console.log(filter.check('şikayet').match);           // false
console.log(filter.censor('Bu s.a.l.a.k bir mesaj')); // Bu ********* bir mesaj
```

The core only analyzes strings; it does not access bot APIs. Categories: `profanity`, `link`, `invite`. A default TR/EN dictionary is loaded unless disabled with `useDefaults: false` or scoped via `languages`.

## Discord.js v14

Install Discord.js separately with `npm install discord.js`. The bot also requires the `MessageContent` Gateway Intent and suitable message deletion permissions.

```ts
import { Client, GatewayIntentBits } from 'discord.js';
import { Filter } from '@thrasherflu/modsent';
import { createDiscordModerator } from '@thrasherflu/modsent/discordjs';

const client = new Client({ intents: [
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.MessageContent,
] });
const filter = new Filter();
client.on('messageCreate', createDiscordModerator({
  filter,
  skip: (message) => !message.guild,
  onError: (error) => console.error('Moderation failed:', error),
}));
client.login(process.env.DISCORD_TOKEN);
```

## grammY

Install grammY separately with `npm install grammy`. Text messages and media captions are checked. The bot needs deletion privileges in the target chat. Use `action: 'none'` for detection-only mode.

```ts
import { Bot } from 'grammy';
import { Filter } from '@thrasherflu/modsent';
import { createGrammyMiddleware } from '@thrasherflu/modsent/grammy';

const bot = new Bot(process.env.BOT_TOKEN!);
bot.use(createGrammyMiddleware({
  filter: new Filter(),
  onError: (error) => console.error(error),
}));
bot.start();
```

## Telegraf

Install Telegraf separately with `npm install telegraf`. Text messages and media captions are checked. The bot must have sufficient permissions in its target chat.

```ts
import { Telegraf } from 'telegraf';
import { Filter } from '@thrasherflu/modsent';
import { createTelegrafMiddleware } from '@thrasherflu/modsent/telegraf';

const bot = new Telegraf(process.env.BOT_TOKEN!);
bot.use(createTelegrafMiddleware({
  filter: new Filter(),
  onError: (error) => console.error(error),
}));
bot.launch();
```

## More copy-paste recipes

Run the [feature demo](examples/demo.mjs) after building the package, or see [Express, Socket.IO, detection-only mode, category policies and per-chat configuration](docs/recipes.md).

## Options and actions

Core constructor options: `words`, `links`, `invites`, `allowlist`, `useDefaults`, `languages` (`tr`, `en`), `shortWordLength`, and `normalization`. Mutation helpers include `addWord`, `removeWord`, `addLink`, `addInvite`, and `addAllow`. Inspect messages with `check` or `checkAll`; mask detected profanity with `censor`.

Adapter options: `filter`, `categories: ['profanity', 'invite', 'link']`, `action: 'delete' | 'none'`, `skip`, `onMatch`, `onError`, and `stopOnMatch`. Discord also supports `includeDMs`. These intentionally do not implement bans, strikes, role checks, or persistent moderation state. Handle those in your application.

Use `categories: ['profanity', 'invite']` to allow ordinary links while blocking invites and profanity. `skip` lets you exempt trusted users and chats. `onError` receives callback or deletion failures; if not provided, errors propagate. For performance, instantiate one Filter per shared configuration, rather than constructing it on every message.

## Comparison

Modsent and [`terlik.js`](https://github.com/badursun/terlik.js/blob/main/README.md) both include Turkish dictionaries and normalization for common evasions. Terlik.js documents a Turkish suffix engine; Modsent does **not** analyze suffixes. Modsent matches longer rules at the start of a token, so some suffixed forms match, but short roots require a boundary on both sides. See the [reproducible 15-message comparison](docs/turkish-comparison.md), including two suffix forms Modsent misses.

Discord [AutoMod](https://support.discord.com/hc/en-us/articles/4421269296535-AutoMod-FAQ) supports custom keywords in any language, while its Commonly Flagged Words lists and Spam Content filter are currently English-only. Its [custom regex rules](https://support.discord.com/hc/en-us/articles/10069840290711-Filter-Messages-Using-Regular-Expressions-Regex) can address evasions. Modsent provides built-in Turkish/English rules and normalization without maintaining those patterns yourself, and the same filter can be used with Telegram adapters as well as Discord.

## Migrating from discord-filter

Read the [step-by-step migration guide](docs/migrating-from-discord-filter.md). Existing `discord-filter` users can continue using their installed version; migration is opt-in. The old package has not been deprecated.

## Development

Building, linting, benchmarking, and testing from source require Node.js 22.12+ with Vitest 5. The published library targets Node.js 18+ and has zero runtime dependencies.

CI additionally compiles integration examples against real Discord.js, grammY and Telegraf declarations and installs the npm tarball in a clean directory to validate package exports.

```sh
npm ci
npm run typecheck
npm run lint
npm test
npm run build
```

Zero production dependencies. ESM/CJS with typings. This is deterministic matching, not an AI toxicity classifier; review false positives and bypass cases for your community.
