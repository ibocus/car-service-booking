# Street Auto Care — booking demo

A proof-of-concept booking page for a car mechanic, built to show the
difference between taking bookings over WhatsApp chat and a structured
booking form.

> **Demo only.** No backend — bookings are kept in the browser's
> `localStorage`. "Brand" is a placeholder (`src/brand.ts`); swap it for a
> real shop name to tailor the demo to a specific prospect.

## What this shows

- **`/` (home)** — the pitch: an old-way-vs-new-way comparison between a
  typical WhatsApp booking chat and a filled-in job card.
- **`#book`** — the customer-facing booking wizard: service, vehicle, a
  day and time window, contact details, review, confirm. Validates as you
  go and ends with a reference number.
- **`#admin`** — the "job sheet": every booking in one list, filterable by
  status, with one-tap actions to confirm, decline, or mark a job done.
  Seeded with a few sample jobs so it isn't empty on first load.

Every booking still has "WhatsApp" links next to it (`src/brand.ts` →
`WHATSAPP_NUMBER`) to make the point that this doesn't replace WhatsApp,
it just means the first message on it already has the job details instead
of starting the conversation from zero.

## Development

```bash
npm install
npm run dev     # http://localhost:5173
npm run build   # typecheck + production build to dist/
```

## Tech

Vite + vanilla TypeScript, no framework or backend — a static site. Data
lives in `localStorage` only (`src/storage.ts`), reset anytime from the
"Reset to sample jobs" link on the job sheet.
