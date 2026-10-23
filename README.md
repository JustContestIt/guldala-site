# Guldala — сайт

Next.js 16 (App Router, Cache Components) + TypeScript + Tailwind 4. Бриф (`guldala-site-brief.md`) и спецификация CRM лежат вне репозитория, в папке проекта.

```bash
npm install
cp .env.example .env.local   # необязательно: Telegram для заявок
npm run dev                  # http://localhost:3000, казахская версия — /kz
npm test                     # расчёт цены и заказа, проверка телефона (Vitest)
```

## Деплой в Docker

**Продакшен** — службой `site` в `crm/deploy/docker-compose.yml`, вместе с CRM и общим Caddy: репозитории `guldala-crm` и `guldala-site` клонируются рядом, сайт отвечает на `DOMAIN` и `botanica.DOMAIN`, `TELEGRAM_*` задаются в `crm/deploy/.env`. Инструкция — `crm/deploy/README.md`. Сейчас (временно, этап A): `https://guldala.endotech.shop`. Адрес для canonical, sitemap и OG пока зашит в `content/site.ts` (`https://guldala.kz`).

Отдельно, без CRM:

```bash
cp .env.example .env          # вписать TELEGRAM_BOT_TOKEN и TELEGRAM_CHAT_ID
docker compose up -d --build  # сайт на :3000
docker compose logs -f        # заявки видны в логе, даже без Telegram
```

Без compose: `docker build -t guldala-site .` и `docker run -d -p 3000:3000 --env-file .env --restart unless-stopped guldala-site`.
Образ собирается из `output: "standalone"`; при сборке нужен интернет (next/font скачивает шрифты).

## Где что лежит

| Путь | Что |
|---|---|
| `app/[lang]/` | Все страницы. `lang` = `ru` или `kz` |
| `proxy.ts` | Русские адреса без префикса (`/tulpan`) отдаются из `/ru/tulpan`; казахские — `/kz/tulpan` |
| `content/dict/ru.ts`, `kz.ts` | Все тексты сайта. `kz` типизирован по `ru` — пропущенный ключ не соберётся |
| `content/` | Цвета, сорта, растения и проекты Botanica, контакты. `PHOTO-BRIEF.md` — ТЗ Татьяне |
| `components/` | Шапка, подвал, переключатель языка, фото-плейсхолдер, карточка сорта, `ui.tsx` |
| `lib/season.ts` | Адаптер данных сезона (`getSeason()`, кэш на час) |
| `lib/mock-season.json` | **Моковые цены, наличие, окно выдачи.** Заменить реальными — UI не трогать |
| `lib/order.ts` | Расчёт заказа: минимум, предоплата, остаток, наличие, слоты выдачи |
| `lib/orders.ts` | Демо-заказ для `/o/demo` |
| `lib/notify.ts` | Уведомление Татьяне в Telegram, пока нет CRM |
| `docs/crm-contract.md` | Контракт с CRM — отдать CRM-сессии |

Цена и наличие на `/tulpan`, в каталоге, в калькуляторе и на странице заказа берутся из одного `getSeason()`.
Чтобы подключить CRM — заменить `mockSeasonSource` в `lib/season.ts` и `getOrder` в `lib/orders.ts` на вызовы API.

## Страницы

`/` · `/tulpan` · `/tulpan/sorta` · `/tulpan/sorta/[slug]` · `/tulpan/zakaz` · `/tulpan/zakaz/gotovo` · `/o/demo` · `/botanica` · `/botanica/rasteniya` · `/botanica/proekty` · `/o-nas` · `/kontakty` — и всё то же под `/kz`.

## Допущения (бриф §14, пока нет ответа)

1. Домен пока не решён: guldala.kz зарегистрирован кем-то в 2025 году (выясняем, не Халиковы ли), guldala.com свободен. Казахская версия — /kz того же домена; Botanica — поддомен `botanica.<домен>` (этап C).
2. Наличие публично словами: много / мало / нет. `maxPacks` только для калькулятора.
3. Русский — основной; казахский переведён полностью, нужна вычитка носителем.
4. Сетка цен и остатки — моковые. Формула из брифа сайта: база 90 → 100 → 115 → 135 ₸ (классика), махровые +30; надбавка 40 % +15, 60 % +10, 80 % +5. Seed в спецификации CRM другой (180–300 ₸) — свести, когда Татьяна пришлёт реальную сетку.
5. Минимум 120 шт — в сумме по заказу, не на цвет (как в CRM).
6. Next.js + Tailwind, деплой — Docker-образ на VPS в Казахстане (домен .kz требует казахстанский IP, Vercel не подходит). Заявки — в Telegram Татьяне (`TELEGRAM_*`), пока нет CRM.
7. Номер заявки на сайте случайный (`T-2027-NNNN`), настоящий выдаст CRM.

## Сделано

- [x] Каркас, токены, шрифты (с казахскими буквами), компоненты, мок-источник
- [x] Главная и `/tulpan`
- [x] Каталог сортов (фильтры в URL) и страница сорта
- [x] Калькулятор и «заявка отправлена» — тесты расчёта, серверная перепроверка, Telegram
- [x] Botanica: витрина, растения, проекты, формы «описать задачу» и «прайс дизайнерам»
- [x] Страница заказа `/o/demo`, о нас, контакты
- [x] Казахская версия всех страниц, переключатель RU/KZ
- [x] SEO: metadata, canonical + hreflang, OG-картинки, sitemap.xml, robots.txt

## Дальше (ревизия брифа 23.10.2026, `../PLAN.md`, один этап на сессию)

- [ ] Этап B: данные из CRM вместо моков (`lib/season.ts`, `lib/orders.ts`, `app/[lang]/tulpan/zakaz/actions.ts`), кэш ≤ 60 с, `?c=TOKEN` с предзаполнением
- [ ] Этап C: заказ собирается в каталоге («+ / −» на карточках, плашка «в заказе»), `/tulpan/zakaz` — оформление без фото, описания сортов, Botanica на поддомене
