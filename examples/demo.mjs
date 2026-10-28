import { Filter } from '@thrasherflu/modsent';

const filter = new Filter();
const samples = [
  ['separator bypass', 's.a.l.a.k'],
  ['obfuscated invite', 'discord,gg/example'],
  ['false-positive guard', 'şikayet'],
];

for (const [label, text] of samples) {
  const result = filter.check(text);
  console.log(label, {
    match: result.match,
    type: result.type,
    matchedText: result.matchedText,
  });
}

console.log('censored:', filter.censor('Bu s.a.l.a.k bir mesaj'));
