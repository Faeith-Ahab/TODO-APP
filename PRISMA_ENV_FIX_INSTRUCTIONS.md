# Fix for `bunx prisma db push` failing: datasource.url required

## Problem
Prisma config (`prisma.config.ts`) expects `process.env.DATABASE_URL`:

```ts
const DATABASE_URL = process.env.DATABASE_URL!

datasource: { url: DATABASE_URL }
```

If `DATABASE_URL` is not present in the environment Prisma runs with (even if you have a `.env` file), Prisma reports:

> The datasource.url property is required in your Prisma config file when using prisma db push.

## Recommended fix (repo code)
Update `prisma.config.ts` to actually load `.env`:

```ts
import { defineConfig } from "prisma/config";
import * as dotenv from "dotenv";

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL!;

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  datasource: { url: DATABASE_URL },
});
```

## Why this is needed
Your `prisma.config.ts` currently imports `dotenv` but does not call `dotenv.config()`, so `process.env.DATABASE_URL` remains `undefined`.

## After code fix
Run:

```powershell
bunx prisma db push
```

Ensure your `.env` contains `DATABASE_URL=...`.

