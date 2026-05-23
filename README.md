# Cottage Bakery Cost Calculator

A browser-based prototype for calculating the real cost of cottage bakery orders.

## Current features

- Component-based orders: base, frosting, filling, garnish, etc.
- Component yield and scale factor: e.g. 24 cupcakes / 12-cupcake recipe = 2x
- Ingredient inventory with supplier-aware starter estimates for Costco, Trader Joe's, and Sprouts
- Ingredient cost rollup by scaled component usage
- Fixed and variable labor models:
  - fixed
  - per item
  - per batch
  - per unit
- Order-level labor for shopping, cleanup, packaging, client communication, etc.
- Extras: packaging, delivery/mileage, platform/payment fees, other supplies
- Utilities and overhead: kitchen hourly overhead, oven cost, fixed order overhead
- Saved order history in browser localStorage
- CSV export

## Run locally

```bash
npm run start
```

Then open:

```text
http://localhost:4178
```

## Deploy

This is a static app. It can deploy directly to Vercel, Netlify, or GitHub Pages.

For Vercel:

```bash
vercel --prod
```

## Data note

This prototype stores inventory, templates, and orders in each browser's localStorage. For real multi-device use, the next version should add auth, a database, backups, and cloud sync.

## Pricing note

The starter ingredient prices are editable estimates. Receipt-verified prices should be treated as the source of truth because grocery costs vary by location, membership/delivery channel, promotions, and date.
