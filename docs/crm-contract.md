# Контракт сайт ↔ CRM

Сайт не хранит цены, наличие и заказы — читает и создаёт их через `/public/*` CRM (`lib/crm.ts`, `lib/season.ts`, `lib/orders.ts`). При расхождении побеждает модель данных CRM (`GULDALA_CRM_SPEC.md`), сайт подстраивается. Реализация в CRM — `crm/services/public.ts`, route handlers в `crm/app/public/`.

**Ревизия 23.10.2026 (этап B)** — контракт сверен с моделью CRM, расхождения решены так (помечены **B**):

- `productId` — uuid товара из CRM (не `red-classic`). `color` — поле `products.color` (`red`, `white`, `pink`, `yellow`, `purple`, `orange`), `type` — `products.tulip_type`.
- `pickupMethod: "self"` ↔ `orders.pickup_method = self_pickup`; `pickupSlot` — строка слота сайта (`"08:00–12:00"`), CRM хранит **начало слота** в `orders.pickup_time` и в `GET /public/orders/{token}` отдаёт `pickup.slot` как `"08:00"`.
- `prices.*.today` — цена за штуку при 100 % предоплаты на сегодня (Asia/Almaty). Если на сегодня правила нет (сезон закончился или ещё не начался) — последняя цена сетки, при пустой сетке `0`; `next` — следующий период сетки при 100 % или `null`.
- `priceGrid` — для каждого правила `price_rules` и каждой точки 40 / 60 / 80 / 100, попадающей в полосу правила: `{ periodEnd: date_to, prepaymentPct, type, pricePerStem }`. На сайте период выбирается по `day <= periodEnd` (сетка должна быть без дыр с сегодняшнего дня).
- `stock.status`: `many` при `available ≥ planned × stock_few_below_pct / 100` (настройка сезона, по умолчанию 30 %), `few` при `available > 0`, `none` при 0. `maxPacks = floor(available / pack_size)`; `available` — спека §9 (план + корректировки − брони − выдано), считается запросом, без кэша.
- `season.id` — uuid сезона; `season.peakHoursFrom` — `settings.peak_hours_from`, может быть `""` (вечерних часов нет).
- Счёт: в `clients` нет полей БИН и названия организации (спека §6) — `legalType` записывается в `orders.comment_client` первой строкой: `Счёт на ТОО «orgName», БИН bin`, `Счёт на ИП` или `Счёт на физ. лицо` (`person`, ревизия 24.10.2026).
- **Холодильник** (ревизия 24.10.2026): `season.storageFeePerDay` — ₸ в сутки за заказ (`settings.storage_fee_per_day`); при `storage: true` CRM берёт `storageFeePerDay × дни` от дня создания заказа до `pickupDate` и включает в `total` (предоплата — от всего `total`). Сайт считает то же самое для показа (`lib/order.ts` `storageDays`), CRM — окончательно. В `GET /public/orders/{token}` — `storageFee` и `storageDays`.
- `invoice.expiresAt` — `null` до этапа G (Kaspi): CRM отдаёт ожидающий счёт Kaspi (`payments.status = pending`, `method = kaspi_invoice`) с суммой.
- `events[].type`: `created`, `confirmed` / `prepaid` / `ready` / `issued` / `expired` / `cancelled` (смены статуса), `invoice` (выставлен счёт), `paid` (оплата). Сайт показывает `created / confirmed / invoice / paid` из словаря, остальные — заголовком статуса.
- Ссылка с предзаполнением ведёт на **каталог** `/tulpan/sorta?c=TOKEN` (этап C): сайт кладёт токен в cookie `guldala_c` на 30 дней и подставляет контакты на оформлении `/tulpan/zakaz`, с какой бы страницы клиент туда ни пришёл; `?c=` прямо на `/tulpan/zakaz` тоже работает. Токен — uuid в `conversations.prefill_token`, срок 30 дней от `prefill_token_at`. `items` в ответе prefill CRM пока не отдаёт.
- `prefillToken` в `POST /public/orders` записывается в событие создания заказа; клиент заказа определяется по телефону (спека §9: телефон — идентичность клиента), переписка не переназначается.
- Ошибки: `400 { error: "человеческий текст" }` — сайт показывает текст как есть (по-русски и в казахской версии); `429` — превышен лимит (5 заявок с номера и 20 с IP-адреса в час; сайт передаёт адрес посетителя в `X-Forwarded-For`); `401` — нет или неверный `X-Public-Secret`.
- После успешного `POST /public/orders` сайт ведёт клиента на `/o/{token}?new=1`: страница заказа очищает корзину и показывает, как оплатить. Страницы `/tulpan/zakaz/gotovo` больше нет.
- Заказ на сайте собирается **по сортам** (этап C), а `items` — строки цвета × типа: сайт складывает пачки сортов одного цвета. Выбранные сорта идут первой строкой `comment`: `Сорта: Strong Love — 3 пач., Bullit — 1 пач.`, дальше комментарий клиента. Поэтому `comment` принимается до 2000 символов (клиентский — до 1000).

## Доступ

Все запросы — с сервера сайта с заголовком `X-Public-Secret: <CRM_PUBLIC_SECRET>` (одно значение в env сайта и CRM, `crm/deploy/.env`). Без него CRM отвечает `401`. Адрес CRM — `CRM_URL` (в compose `http://app:3001`, внутри сети Docker).

## GET /public/season/current

```ts
{
  season: {
    id: string;              // uuid сезона
    name: string;
    saleOpen: boolean;       // seasons.status = open
    peakDate: string;        // "2027-03-08"
    pickupFrom: string;      // окно выдачи, seasons.pickup_from
    pickupTo: string;        // seasons.pickup_to
    peakHoursFrom: string;   // с этой даты выдача до 23:00, settings.peak_hours_from; "" = нет
    storageFeePerDay: number; // холодильник, ₸ в сутки за заказ (settings.storage_fee_per_day)
  };
  asOf: string;              // ISO, момент расчёта «сегодня»
  prices: {
    classic: { today: number; next: { from: string; price: number } | null };
    double:  { today: number; next: { from: string; price: number } | null };
  };
  priceGrid: { periodEnd: string; prepaymentPct: 40 | 60 | 80 | 100; type: "classic" | "double"; pricePerStem: number }[];
  stock: { productId: string; color: string; type: "classic" | "double"; status: "many" | "few" | "none"; maxPacks: number }[];
}
```

`404 { error }` — сезона нет.

## POST /public/orders

```ts
// body
{
  items: { productId: string; packs: number }[];
  prepaymentPct: 40 | 60 | 80 | 100;
  pickupDate: string;            // YYYY-MM-DD внутри окна выдачи
  pickupSlot: string;            // "08:00–12:00" … "21:00–23:00" — в CRM уходит начало слота
  pickupMethod: "self" | "client_truck";
  storage: boolean;
  client: { company: string; name: string; phone: string /* +7… */; legalType: "ip" | "too" | "person"; bin?: string; orgName?: string };
  comment: string;
  source: "site";
  prefillToken?: string;         // из ?c=TOKEN
}
// → 200 { orderNumber, token, holdUntil, total, prepaymentAmount, pricesLockedAt: null }
// → 400 { error } — минимум 120 шт, наличие, окно и слот выдачи, телефон, нет цены на сегодня, нет открытого сезона
// → 429 { error } — лимит
```

Сайт проверяет то же самое до отправки, CRM — окончательно, в транзакции с блокировкой остатков (спека §9). Заказ создаётся с `created_by = client`, `channel = site`, статус `confirmed` с бронью на `hold_days` или `new` от `check_threshold_amount`; при нехватке остатка заказ **не создаётся** (клиентская форма, спека §9). Сразу после создания клиенту уходит `booking` через провайдер сообщений, Татьяне — строка в лог CRM (`docker compose logs app | grep '\[site\]'`; Telegram — этап H).

## GET /public/orders/{token}

```ts
{
  orderNumber: string;
  status: "new" | "confirmed" | "prepaid" | "ready" | "issued" | "expired" | "cancelled";
  holdUntil: string | null;      // только для confirmed
  prepaymentPct: number;
  items: { productId: string; color: string; type: string; packs: number; stems: number; pricePerStem: number; sum: number }[];
  storageFee: number;            // холодильник, уже в total; 0 — без хранения
  storageDays: number;
  total: number;
  paid: number;
  prepaymentDue: number;
  invoice: { provider: "kaspi"; amount: number; expiresAt: null } | null;
  pickup: { date: string | null; slot: string; method: "self" | "client_truck"; storage: boolean };
  events: { at: string; type: string }[];   // по порядку, см. список типов выше
  asOf: string;                             // часы CRM — для «осталось N дней»
}
```

Открытие страницы пересчитывает незафиксированный заказ по сетке на сегодня, как карточка в CRM. `404` — токена нет.

## GET /public/prefill/{token}

```ts
// → 200 { client: { name: string; company: string; phone: string } }
// → 404, если токен неизвестен или старше 30 дней: сайт молча показывает пустую форму
```

Токен выдаёт кнопка «Ссылка для заказа» в CRM (экран «Расчёт», под текстом ответа клиенту): она дописывает в текст `Оформить заказ на сайте: <SITE_URL>/tulpan/sorta?c=TOKEN`, дальше «Скопировать» или «Отправить в WhatsApp».

## POST /public/leads, POST /public/designer-price

Формы лендинга Botanica (`botanica.<домен>`).

```ts
{ segment: "private" | "office" | "horeca"; phone: string; company?: string; message: string }
{ company: string; phone: string }
// → 200 { ok: true } | 400 { error } | 429
```

Отдельной таблицы лидов нет: CRM создаёт или находит клиента по телефону (`source = inbound_message`, `client_type`: private → `private`, office / horeca → `other`, дизайнер → `landscaper`) и дописывает в `clients.notes` строку с датой, сегментом, компанией и сообщением.

## Свежесть данных

`GET /public/season/current` сайт кэширует не дольше 60 секунд (`lib/season.ts`: `"use cache"`, `cacheLife({ revalidate: 30, expire: 60 })`) и сбрасывает кэш тегом `season` после каждого `POST /public/orders`. Страница заказа и prefill не кэшируются. При сборке образа сайт к CRM не обращается: страницы с данными сезона рендерятся на запрос (`connection()` + `<Suspense>`).
