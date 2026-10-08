# 🛒 বাজার দর (BazarDor)

নিত্যপ্রয়োজনীয় পণ্যের আজকের দাম এক নজরে — চাল, ডাল, তেল, সবজি, মাছ, মাংস ও মসলার দর, দাম বাড়া/কমার হার এবং দেশের বিভিন্ন বাজারের তুলনাসহ।

A Bengali market-price tracker built with Next.js. Browse today's prices, see which products went up or down, compare prices across bazars, and sign in to view full product details.

## Technologies used

| Purpose | Tech |
| --- | --- |
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS 4 + DaisyUI 5 |
| Auth | BetterAuth (email/password, Google, GitHub) + MongoDB |
| Notifications | react-hot-toast |
| Data | BazarDor REST API (proxied through a Next route handler with fallback URL) |
| Deploy | Vercel |

## Key features

1. **Live price ticker** — infinite marquee under the navbar with emoji, name, price per unit and ▲/▼ change.
2. **Daily movers** — top 6 price risers and top 6 fallers, plus the full product grid with Bengali digits.
3. **Category pages with sorting** — sort by price low→high / high→low using numeric values (not Bengali strings), skeleton loading and empty/404 states.
4. **Protected product details** — min / max / average price, price history, and per-bazar prices grouped by division.
5. **Authentication** — BetterAuth email/password + Google + GitHub, toast feedback, protected-route redirects.
6. **Profile & update** — view profile and update your name via BetterAuth `updateUser`.
7. **Fully responsive** — mobile, tablet and desktop.

## Getting started

```bash
npm install
cp .env.example .env.local     # fill in the values (collections are created automatically in MongoDB)
npm run dev
```

### Environment variables

See `.env.example`. You need a MongoDB database (MongoDB Atlas free tier; allow `0.0.0.0/0` in Network Access so Vercel can connect), a `BETTER_AUTH_SECRET`, and OAuth apps:

- Google callback URL: `{BETTER_AUTH_URL}/api/auth/callback/google`
- GitHub callback URL: `{BETTER_AUTH_URL}/api/auth/callback/github`

## Deploy to Vercel

1. Push to GitHub and import the repo in Vercel.
2. Add every variable from `.env.example` (set `BETTER_AUTH_URL` to your live URL).
3. Add the live URL's callback links to your Google and GitHub OAuth apps.
4. Redeploy. Dynamic routes (`/category/[slug]`, `/product/[slug]`) work on refresh.
