# GiDi Pharmacy Management

Built by Abdallah Fuseini.

GiDi is a pharmacy app for inventory, sales, expiry tracking, staff join codes, reports, and Azara, the in-app reference assistant. Web and mobile live in this repo.

## Azara

Azara answers from the built-in reference library and from the signed-in pharmacy's stock. It does not call an external model.

Commands it acts on:

- `list inventory`
- `low stock`
- `expiring stock`
- `out of stock`
- `how many cetirizine`
- `remember: topic | what to answer next time`

Notes and low-confidence questions stay in the pharmacy knowledge panel so the team can correct Azara.

## Layout

- `apps/web` — Next.js app and API
- `apps/mobile` — Expo app (EAS)

## Publish

Secrets are not in git. Copy `apps/web/.env.example` and `apps/mobile/.env.example` and fill them locally or in EAS secrets.

```bash
cd apps/mobile
eas build --platform all --profile production
eas submit --platform all --profile production
```

Store submission still needs your Apple Developer account, App Store Connect app, Google Play Console app, and signing credentials. `eas.json` submits Android to the internal track as a draft.

Set the Expo account owner in `apps/mobile/app.json` to the account that will run EAS before the first production build.
