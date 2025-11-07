# JamLoop UI Engineer Challenge

Campaign management system for advertising campaigns. Built with Next.js 16 and Supabase.

## Tech Stack

- Next.js 16 (App Router)
- Supabase (Postgres + Auth + RLS)
- TypeScript + Zod
- Tailwind CSS
- React Hook Form

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Copy `env.example` to `.env.local` and fill in your Supabase credentials:

```bash
cp env.example .env.local
```

Get your Supabase credentials from: `https://app.supabase.com/project/_/settings/api`

### 3. Set Up Database

Open `supabase/migrations/001_initial_schema.sql` and run it in your Supabase SQL Editor. This creates the tables, RLS policies, and demo accounts.

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000/login](http://localhost:3000/login)

### 5. Sign In

Demo accounts:
- `acme.owner@example.com` / `Passw0rd!`
- `globex.manager@example.com` / `Passw0rd!`

Each account can only see their own campaigns (enforced by database RLS).

## Features

**Campaign Management**
- Create, read, update, delete campaigns
- All required fields: name, budget, dates, demographics, location, screens, publishers
- Form validation on client and server

**Data Table**
- Pagination
- Search by name
- Filter by date range, screens, and publishers
- Loading and empty states

**Security**
- Row-Level Security (RLS) at database level
- Each account can only access their own campaigns
- Protected routes and API endpoints
- Server-side validation

## Project Structure

```
src/
├── app/
│   ├── (protected)/    # Protected routes
│   ├── api/campaigns/  # API endpoints
│   └── login/          # Login page
├── components/         # UI components
├── lib/                # Supabase client, schemas, utilities
└── types/              # TypeScript types
```

## What's Missing

See [REMAINING.md](./REMAINING.md) for things to add before production.
