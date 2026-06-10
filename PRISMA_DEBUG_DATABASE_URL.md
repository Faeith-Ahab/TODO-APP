# Prisma db push: missing datasource.url

## Symptom
`bunx prisma db push` fails with:

> The datasource.url property is required in your Prisma config file when using prisma db push.

## Root cause
`prisma.config.ts` reads `process.env.DATABASE_URL`:

```ts
const DATABASE_URL = process.env.DATABASE_URL!
...
datasource: { url: DATABASE_URL }
```

If `DATABASE_URL` is not set (or not loaded), Prisma reports that `datasource.url` is required.

## Fix
Set `DATABASE_URL` in your environment before running:

```bash
bunx prisma db push
```

If you keep it in `.env`, make sure `bunx prisma` loads it OR set it inline:

```bash
set DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DB
bunx prisma db push
```

## Additional fix recommended in repo
Update `prisma.config.ts` to actually load `.env` (right now it imports `dotenv` but never calls `dotenv.config()`).

