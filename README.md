# dreaming.now

## Getting Started

1. Install [Node.js](https://nodejs.org/en) and [pnpm](https://pnpm.io/).
2. Set up a MongoDB instance.
3. `cp .env.example .env` and enter the `MONGODB_URI` there.
4. Uncomment the "Create project" buttons in `app/page.tsx`, line 99 and lines 118 to 122.
5. Run the development server: `pnpm dev`
6. Open [http://localhost:3005](http://localhost:3005) with your browser to see the result.

## Adding funds to users' accounts

1. Find the webhook secret in the `Project` MongoDB collection.
2. If you want a different authentication provider, add this at `app/api/auth/route.ts`.
3. Execute a HTTP request like this:

```
curl "https://dreaming.now/api/projects/<slug>/funds" -X POST --data '{"userId":"<user ID>","amount":10}' -H "X-Webhook-Secret: <uuid>"
```

Upon success, this endpoint returns a JSON object like `{"success":true}`.

## License

GPL

## Contact

[synergies@dreaming.now](mailto:synergies@dreaming.now)
