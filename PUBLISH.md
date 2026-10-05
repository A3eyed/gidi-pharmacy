# Publish checklist

Built by Abdallah Fuseini. This repo is not submitted to any store yet.

## Desktop and web

A pharmacy PC installs GiDi from the browser. Chrome and Edge show "Install GiDi for this computer" after the site is deployed. The installed window has no browser chrome. The service worker keeps the last successful inventory, sales and Azara responses on that computer and shows them when the network drops. New sales still need a connection to reach the shared database.

## Mobile

The Expo app caches the last inventory list for the current search. Azara's reference answers are in the app. Stock changes still sync through the API.

## Not ready to submit

- Apple Developer account, App Store Connect app, and Sign in with Apple if used.
- Google Play Console app and a service account JSON. `eas.json` expects `apps/mobile/google-service-account.json`, which is not in git.
- Expo owner in `apps/mobile/app.json` must be the account that runs EAS.
- `AUTH_SECRET` is not on the Vercel project. Email sign-in on a new deploy needs it.
- Microsoft Store and Mac App Store are not configured. The desktop path is the installed web app, not a Store binary.

## When the accounts exist

```bash
cd apps/mobile
eas build --platform all --profile production
eas submit --platform all --profile production
```

Android submits to the internal track as a draft.
