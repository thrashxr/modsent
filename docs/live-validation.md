# Manual live verification — October 23, 2026

This is a record of **user-operated smoke tests**, not automated CI or a guarantee for every deployment.

| Integration | Test | Outcome |
| --- | --- | --- |
| Discord.js | Observed profanity (`salak`, `s.a.l.a.k`), Discord invite (`discord.gg/test123`, `discord,gg/test123`), and ordinary URL (`https://example.com`) | Passed |
| Discord.js | Same messages deleted with `action: 'delete'` | Passed |
| Discord.js | Removed `Manage Messages`; received Discord REST 403 / code 50013 through `onError` | Passed |
| grammY | Observed same categories; message and Telegram media-caption profanity detected | Passed |
| grammY | Same messages deleted with `action: 'delete'` | Passed |
| grammY | With deletion permission removed and valid test chat ID configured, Telegram API returned 400 `message can't be deleted` through `onError` | Passed |
| Telegraf | Deleted profanity, separator obfuscation and an obfuscated Discord invitation | Passed |
| Telegraf | Normal `şikayet` remained undeleted | Passed |
| Discord.js / grammY | Ordinary `şikayet` and `picture` messages stayed undeleted | Passed |

The permission-failure tests were performed in isolated test environments. The initial grammY no-error observation was caused by a mismatched `TELEGRAM_CHAT_ID`; correcting the ID allowed the expected error to be observed.

## Limits

- Telegraf was not separately tested with deletion permission revoked.
- High-volume moderation, concurrent bot sessions, message edit handling, private-chat policies and long-running production use were not covered.
- Distinguish failure to receive an event from `skip` handling and API failures when debugging.
- Keep bots scoped to dedicated channels/chats until administrators review their moderation policy.
