# Контракт сайт ↔ CRM

Для CRM-сессии. Сайт не хранит цены, наличие и заказы — читает и создаёт их через эти эндпоинты. Сейчас на сайте моки той же формы (`lib/mock-season.ts`, `lib/orders.ts`). При расхождении побеждает модель данных CRM (`GULDALA_CRM_SPEC.md`), сайт подстроится.

Базовый контракт — бриф сайта §9. Ниже он же с тремя дополнениями, которые сайту уже понадобились (помечены **+**).

## GET /public/season/current

```ts
{
  season: {
    id: string;              // "2027"
    name: string;
    saleOpen: boolean;
    peakDate: string;        // "2027-03-08"
    pickupFrom: string;      // + окно выдачи, seasons.pickup_from
    pickupTo: string;        // + seasons.pickup_to
    peakHoursFrom: string;   // + с этой даты выдача до 23:00, settings.peak_hours_from
  };
  asOf: string;              // ISO, момент расчёта «сегодня»
  prices: {
    classic: { today: number; next: { from: string; price: number } | null };  // + next = null в последнем периоде
    double:  { today: number; next: { from: string; price: number } | null };
  };
  priceGrid: { periodEnd: string; prepaymentPct: 40 | 60 | 80 | 100; type: "classic" | "double"; pricePerStem: number }[];
  stock: { productId: string; color: string; type: "classic" | "double"; status: "many" | "few" | "none"; maxPacks?: number }[];
}
```

- `prices.*.today` — цена за штуку при 100 % предоплаты на дату `asOf` (таймзона Asia/Almaty).
- `priceGrid` — полосы предоплаты на сайте фиксированы: 40 / 60 / 80 / 100. Если в CRM шаг 10 %, отдайте значения для этих четырёх точек.
- `maxPacks` нужен только калькулятору, чтобы остановить степпер. Публично число не показывается.
- `productId` на сайте сейчас вида `red-classic`; подойдёт любой стабильный id.

## POST /public/orders

```ts
// body
{
  items: { productId: string; packs: number }[];
  prepaymentPct: 40 | 60 | 80 | 100;
  pickupDate: string;            // YYYY-MM-DD внутри окна выдачи
  pickupSlot: string;            // "08:00–12:00" … "21:00–23:00"
  pickupMethod: "self" | "client_truck";
  storage: boolean;
  client: { company: string; name: string; phone: string /* E.164 +7… */; legalType: "ip" | "too"; bin?: string; orgName?: string };
  comment: string;
  source: "site";
}
// → { orderNumber, token, holdUntil, total, prepaymentAmount, pricesLockedAt: null }
```

Сайт уже проверяет минимум 120 шт в сумме, наличие, окно и слот выдачи, телефон КЗ и БИН (12 цифр) для ТОО — CRM всё равно перепроверяет. `orgName` — **+**, для счёта на ТОО.

## GET /public/orders/{token}

```ts
{
  orderNumber: string;
  status: "new" | "confirmed" | "prepaid" | "ready" | "issued" | "expired" | "cancelled";
  holdUntil: string | null;
  prepaymentPct: number;         // + показываем «Предоплата 60 %»
  items: { productId: string; color: string; type: string; packs: number; stems: number; pricePerStem: number; sum: number }[];
  total: number;
  paid: number;
  prepaymentDue: number;
  invoice: { provider: "kaspi"; amount: number; expiresAt: string } | null;
  pickup: { date: string; slot: string; method: "self" | "client_truck"; storage: boolean };
  events: { at: string; type: string }[];   // сайт знает created / confirmed / invoice, остальные покажет после добавления в словарь
}
```

Тексты статусов — в `content/dict/*.ts` → `statuses`, по одному словарю на язык.

## POST /public/leads, POST /public/designer-price

```ts
{ segment: "private" | "office" | "horeca"; phone: string; company?: string; message: string }
{ company: string; phone: string }
```

## GET /public/prefill/{token} — **+ ревизия 23.10.2026** (этап B)

Ссылка из WhatsApp `/tulpan/sorta?c=TOKEN`: токен выдаёт CRM (кнопка в карточке клиента или ассистент, спека §19) и хранит в `conversations.prefill_token`.

```ts
// → 200
{ client: { name: string; company: string; phone: string }; items?: { productId: string; packs: number }[] }
// → 404, если токен неизвестен или старше 30 дней: сайт молча показывает пустую форму
```

`POST /public/orders` принимает необязательный `prefillToken: string` — CRM привязывает заказ к клиенту и переписке, даже если клиент поправил телефон.

## Свежесть данных — **+ ревизия 23.10.2026**

`stock` должен быть актуальным: сайт кэширует `GET /public/season/current` не дольше 60 секунд и сбрасывает кэш после каждого `POST /public/orders`. CRM считает остатки запросом (спека §9), отдельного кэша на её стороне нет. Запросы сайта к CRM идут с сервера сайта с заголовком-секретом (`CRM_PUBLIC_SECRET`), чтобы `/public/*` не был открыт всему интернету.

## Пока CRM нет

Заявки и лиды уходят Татьяне сообщением в Telegram (`lib/notify.ts`, переменные в `.env.example`). Без переменных — только лог сервера.
