# dreaming.now

## Try it

1. Go to https://dreaming.now
2. Login with these credentials:
   - email: demo+dreaming.now@divizend.com
   - password: 12345678
3. Play around in the platform! Feel free to assign funds within the "My Awesome Community" project and create new projects, buckets and budget items.

If you'd like to assign funds to an account to use it productively, please contact me at julian@dreaming.now.

## Getting Started

1. Install [Node.js](https://nodejs.org/en) and [pnpm](https://pnpm.io/).
2. Set up a MongoDB instance.
3. `cp .env.example .env` and enter the `MONGODB_URI` there.
4. Modify line 23 in `app/page.tsx` to read `const allowCreateProject = true;`
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
