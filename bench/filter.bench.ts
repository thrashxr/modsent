import { describe, test } from 'vitest';
import { Filter } from '../src/index';

function makeRules(n: number): string[] {
  const rules: string[] = [];
  for (let i = 0; i < n; i++) rules.push(`customrule${i}`);
  return rules;
}

const SHORT = 'hey what is up';
const NORMAL =
  'hey everyone, check out my new project at https://example.com it took a while to build and I am pretty happy with it lol';
const LARGE = NORMAL.repeat(40);
const EVASIVE = 'you are such a s.a.l.a.k and a f u c k i n g saaalak honestly';

const dInit = new Filter();
const d100 = new Filter({ words: makeRules(100) });
const d1k = new Filter({ words: makeRules(1_000) });
const d10k = new Filter({ words: makeRules(10_000) });

describe('check() by message size (defaults only)', () => {
  test('short message', async ({ bench }) => {
    await bench('short message', () => void dInit.check(SHORT)).run();
  });
  test('normal discord message', async ({ bench }) => {
    await bench('normal discord message', () => void dInit.check(NORMAL)).run();
  });
  test('large message (~40x)', async ({ bench }) => {
    await bench('large message (~40x)', () => void dInit.check(LARGE)).run();
  });
  test('evasive message', async ({ bench }) => {
    await bench('evasive message', () => void dInit.check(EVASIVE)).run();
  });
});

describe('check() by rule count (normal message)', () => {
  test('100 rules', async ({ bench }) => {
    await bench('100 rules', () => void d100.check(NORMAL)).run();
  });
  test('1,000 rules', async ({ bench }) => {
    await bench('1,000 rules', () => void d1k.check(NORMAL)).run();
  });
  test('10,000 rules', async ({ bench }) => {
    await bench('10,000 rules', () => void d10k.check(NORMAL)).run();
  });
});

describe('compile cost (constructor)', () => {
  const r1k = makeRules(1_000);
  const r10k = makeRules(10_000);
  test('compile 1,000 rules', async ({ bench }) => {
    await bench('compile 1,000 rules', () => void new Filter({ words: r1k })).run();
  });
  test('compile 10,000 rules', async ({ bench }) => {
    await bench('compile 10,000 rules', () => void new Filter({ words: r10k })).run();
  });
});
