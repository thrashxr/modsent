# Modsent: Türkçe ve İngilizce içerik moderasyonu

`discord-filter`, Discord botları için başlayan bir filtre projesiydi. Motor zamanla Discord.js'e bağlı olmayan, farklı uygulamalarda da kullanılabilen bir yapıya dönüştü. Modsent adı ve `@thrasherflu/modsent` paketi bu ayrımı netleştiriyor: çekirdek filtre framework bağımsız, Discord.js, grammY ve Telegraf entegrasyonları ise isteğe bağlı adapter'lar.

Modsent; Türkçe ve İngilizce küfürleri, bağlantıları ve Discord davetlerini tek API ile kontrol ediyor. `s.a.l.a.k`, tekrarlanan karakterler, leetspeak ve benzer görünen Unicode karakterleri gibi bypass denemelerini normalize ediyor. Kısa kelimelerde sınır kontrolü ve allowlist yaklaşımı sayesinde `şikayet` gibi normal kelimelerin yanlış eşleşmesini önlemeye odaklanıyor.

```ts
import { Filter } from '@thrasherflu/modsent';

const filter = new Filter();

filter.check('s.a.l.a.k');          // profanity
filter.check('discord,gg/example'); // invite
filter.check('şikayet');            // no match
```

Paketin runtime dependency'si yok; ESM, CommonJS ve TypeScript tipleri birlikte geliyor. Hazır adapter'lar mesaj silme veya yalnızca tespit modunda kullanılabiliyor, kalıcı ceza ve rol politikaları ise uygulamada kalıyor.

- npm: https://www.npmjs.com/package/@thrasherflu/modsent
- GitHub: https://github.com/thrashxr/modsent
- Geçiş rehberi: https://github.com/thrashxr/modsent/blob/main/docs/migrating-from-discord-filter.md
