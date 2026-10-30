// Run after building Modsent: node examples/turkish-comparison.mjs /path/to/terlik.js/dist/index.mjs
import { Filter } from '@thrasherflu/modsent';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

if (!process.argv[2]) throw new Error('Pass the path to terlik.js dist/index.mjs');
const { Terlik } = await import(pathToFileURL(resolve(process.argv[2])).href);
const modsent = new Filter();
const terlik = new Terlik();

// Labels describe intended profanity moderation for these messages, not linguistic ground truth.
const samples = [
  ['plain', true, 'salak'],
  ['plain', true, 'siktir git'],
  ['suffix', true, 'salaklar'],
  ['suffix', true, 'siktirler'],
  ['suffix', true, 'siktiler'],
  ['suffix', true, 'sikermisiniz'],
  ['separator', true, 's.a.l.a.k'],
  ['separator + suffix', true, 's.i.k.t.i.r.l.e.r'],
  ['leet', true, 's4lak'],
  ['repetition', true, 'saaalak'],
  ['clean', false, 'şikayet'],
  ['clean', false, 'sıkıntı'],
  ['clean', false, 'sikke'],
  ['clean', false, 'siklet'],
  ['clean', false, 'bu güzel bir gün'],
];

for (const [category, expected, message] of samples) {
  const m = modsent.checkAll(message).matches.some((match) => match.type === 'profanity');
  const t = terlik.containsProfanity(message);
  console.log(JSON.stringify({ category, message, expected, modsent: m, terlik: t }));
}
