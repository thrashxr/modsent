# Turkish profanity comparison

This is a small, hand-labelled diagnostic set, not a representative benchmark or a measure of overall accuracy. Labels reflect the intended moderation decision for each message. Both tools use their default configuration: Modsent 3.0.1 (`new Filter()`) and [terlik.js 2.6.0](https://www.npmjs.com/package/terlik.js/v/2.6.0) (`new Terlik()`). Only profanity matches are compared; links and invites are outside this set. Checked October 28, 2026.

| Category | Message | Expected | Modsent | terlik.js |
| --- | --- | --- | --- | --- |
| Plain | `salak` | Match | Match | Match |
| Plain | `siktir git` | Match | Match | Match |
| Suffix | `salaklar` | Match | Match | Match |
| Suffix | `siktirler` | Match | Match | Match |
| Suffix | `siktiler` | Match | Miss | Match |
| Suffix | `sikermisiniz` | Match | Miss | Match |
| Separator | `s.a.l.a.k` | Match | Match | Match |
| Separator + suffix | `s.i.k.t.i.r.l.e.r` | Match | Match | Match |
| Leet | `s4lak` | Match | Match | Match |
| Repetition | `saaalak` | Match | Match | Match |
| Clean | `şikayet` | No match | No match | No match |
| Clean | `sıkıntı` | No match | No match | No match |
| Clean | `sikke` | No match | No match | No match |
| Clean | `siklet` | No match | No match | No match |
| Clean | `bu güzel bir gün` | No match | No match | No match |

Modsent detected 8 of the 10 labelled profanity cases and flagged none of the 5 clean cases; terlik.js detected all 10 and flagged none of the 5. These counts apply only to this set, which was chosen to expose specific behaviors; the tools have different dictionaries and can produce different results on other messages.

## Why suffixes differ

Modsent normalizes text and compares it with dictionary rules. By default, rules of three or fewer normalized characters require boundaries on both sides; longer rules require a left boundary but may continue into the rest of the token. Thus `salaklar` matches the longer `salak` rule, while `siktiler` does not match the short `sik` rule. This is prefix matching, not Turkish morphological analysis: it can miss inflections and can also match unrelated words beginning with a longer rule. The allowlist can exempt specific tokens. See [matcher source](https://github.com/thrashxr/modsent/blob/main/src/matchers/profanity.ts) and [default Turkish rules](https://github.com/thrashxr/modsent/blob/main/src/defaults/tr.ts).

Terlik.js documents a [language-aware normalization pipeline and Turkish suffix handling](https://github.com/badursun/terlik.js/blob/main/README.md#how-it-works). Its dictionary and modes make different precision/coverage trade-offs.

## Reproduce

In a source checkout with Node.js 22.12+ and npm installed:

```sh
npm ci
npm run build
npm install --no-save --package-lock=false --ignore-scripts terlik.js@2.6.0
node examples/turkish-comparison.mjs node_modules/terlik.js/dist/index.mjs
```

The script prints one JSON object per labelled case. Installing terlik.js this way is only for the comparison and does not add a runtime dependency to Modsent.
