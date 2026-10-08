
# PlacementOS (CampusVault_3.0)

PlacementOS is being built directly inside this repository as a full-stack campus placement platform.

## Workspace

- `client/` — React + TypeScript + Vite frontend
- `server/` — Express + TypeScript backend
- `server/prisma/schema.prisma` — database schema
- `docker-compose.yml` — local PostgreSQL + Redis
  
## Quick Start

1. Copy `.env.example` to `.env` in the repository root and fill secrets.
   - Default local DB in this repo is configured as:
   - DB Name: `CampusVault`
   - DB User: `postgres`
   - DB Password: `admin`
2. Start infra:
   - `docker compose up -d`
3. Install dependencies:
   - `npm install`
4. Generate Prisma client:
   - `npm run prisma:generate`
5. Run initial migration:
   - `npm run prisma:migrate`
6. Seed demo data:
   - `npm run prisma:seed`
7. Run frontend and backend in separate terminals:
   - `npm run dev-client`
   - `npm run dev-server`

## Demo credentials

- Email: `demo@placementos.dev`
- Password: `Demo12345!`

