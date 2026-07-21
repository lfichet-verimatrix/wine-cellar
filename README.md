# 🍷 Wine Cellar

A personal wine cellar management app built with the MERN stack (MongoDB, Express, React 19, Node.js).

## Features

- **CRUD** — Add, browse, edit, and delete wines from your collection
- **Filtering** — Filter by type, status, search by name/producer
- **Interactive Map** — SVG map of French wine regions (generated from real geographic data); click a region to filter wines
- **Region Mapping** — Sub-regions/appellations are mapped to parent regions (e.g., "Haut-Médoc" → Bordeaux)
- **Stats Panel** — Total bottles, cellar value, breakdown by type
- **Draggable Modals** — Edit/create forms can be repositioned by dragging the header

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, CSS Modules |
| Backend | Node.js, Express 5 |
| Database | MongoDB (Mongoose) |
| Testing | Jest, Supertest, Vitest, React Testing Library |

## Getting Started

### Prerequisites

- Node.js 18+
- Docker (for MongoDB)

### Quick Start

```bash
# Install dependencies
npm install
cd client && npm install && cd ..

# Start everything (MongoDB, backend, frontend)
./start.sh
```

The app will be available at:
- **Frontend**: http://localhost:5173
- **API**: http://localhost:3000

### Stop

```bash
./stop.sh
```

### Seed Data

To populate the database with sample wines:

```bash
npm run seed
```

## Project Structure

```
├── client/                 # React frontend (Vite)
│   └── src/
│       ├── components/
│       │   ├── ui/         # Reusable UI components (Button, Modal, Input...)
│       │   └── wines/      # Wine feature components (WineCard, WineForm, WineMap...)
│       ├── pages/          # WineDashboard
│       ├── services/       # API client
│       └── styles/         # Global CSS & design tokens
├── src/                    # Express backend
│   ├── config/             # DB connection, env config
│   ├── controllers/        # Route handlers
│   ├── middlewares/        # Validation, error handling
│   ├── models/             # Mongoose schemas
│   ├── routes/             # Express routers + Zod schemas
│   ├── services/           # Business logic
│   └── utils/              # Logger, custom errors
├── scripts/                # Seed script
├── tests/                  # Backend integration tests
├── docs/                   # Requirements, design, implementation plan
└── wines.json              # Seed data
```

## API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /wines | List wines (query: type, status, search) |
| GET | /wines/:id | Get a wine by ID |
| POST | /wines | Create a wine |
| PUT | /wines/:id | Update a wine |
| DELETE | /wines/:id | Delete a wine |

All responses follow: `{ success: boolean, data?: any, error?: string }`

## Testing

```bash
# Backend tests
npm test

# Frontend tests
cd client && npm test
```

## License

ISC
