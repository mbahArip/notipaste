# Notipaste

Notipaste is a Notion-like block styled pastebin built by Next.js and Pocketbase.

## Motivation

The main reason why I created Notipaste is because I want to learn more about Pocketbase.  
But I don't want to create a project that won't be used, at least by me.  
So I decided to create a pastebin, because I use pastebin a lot to share or save my code snippets.

## Features

- Guest
  - Create paste (Only lasts for 14 days)
  - Delete paste via link provided after paste creation
- Authenticated user
  - Create paste (Permanent)
  - Edit paste
  - Delete paste
  - Set paste visibility (Public, Private)
  - Protect paste with password
  - Set paste expiration (Never, 1 day, 7 days, 14 days, 30 days)
  - Upload image to paste (Max file size: 5 MB)

## Development / Self-hosting

### Requirements

- Node.js 16.x or later
- Package manager (npm, yarn, pnpm, etc.)
- Pocketbase

### Setup

1. Clone this repository  
   `git clone`
2. Install dependencies  
   `npm install` or `yarn` or `pnpm install`
3. Create `.env.local` file  
   `cp .env.local.example .env.local`
4. Replace `.env.local` variables
5. Run Pocketbase server  
   `pocketbase serve`
6. [Import Pocketbase tables](#import-pocketbase-schema)
7. Run development server  
   `npm run dev` or `yarn dev` or `pnpm dev`

### Environment variables

| Variable name                | Description                                                                          |
| ---------------------------- | ------------------------------------------------------------------------------------ |
| `NEXT_PUBLIC_POCKETBASE_URL` | Pocketbase API URL (Default `localhost:8090`)                                        |
| `POCKETBASE_EMAIL`           | Pocketbase Admin email                                                               |
| `POCKETBASE_PASSWORD`        | Pocketbase Admin password                                                            |
| `NEXT_PUBLIC_VERCEL_URL`     | Vercel URL (Default `localhost:3000` on dev, and generated deployment URL on Vercel) |
| `VERCEL_URL`                 | Vercel URL (Default `localhost:3000` on dev, and generated deployment URL on Vercel) |

### Import Pocketbase schema

1. Go to Pocketbase admin page  
   `http://localhost:8090/admin`
2. Login with your Pocketbase admin account
3. Open `Settings` page
4. Open `Import collections` menu
5. Click `Load from JSON file` button
6. Select `pocketbase-schema.json` file from `db/schema.json` directory

## License

MIT License
