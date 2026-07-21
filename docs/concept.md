# Wine Cellar Management App — Concept

## Overview

A simple, single-user web application for managing a personal wine cellar inventory. The app allows the user to catalog their wine collection, track quantities, record personal ratings and tasting notes, and filter/browse their cellar.

## Core Idea

Replace the existing task management app with a wine cellar inventory manager built on the same MERN stack (MongoDB, Express, React, Node.js). The app is a straightforward CRUD application — no complex features like storage location management, consumption history tracking, or external database lookups.

## Key Features

- **Add wines** to the cellar with details (name, producer, vintage, type, grape, region, country, quantity, price, rating, notes, status)
- **Browse wines** in a modern dashboard with filtering and search
- **Edit wines** to update details (e.g., adjust quantity after drinking a bottle)
- **Delete wines** from the collection
- **Filter** by type (Red, White, Rosé, etc.), status (In Cellar, Consumed, Wishlist), or search by name/producer
- **Region map** — interactive SVG map of French wine regions that highlights regions with wines in the cellar; click a region to filter
- **Stats overview** — total bottles, cellar value, breakdown by type

## Target User

A single user (the cellar owner) managing their personal wine collection via a web browser. No authentication required for the MVP.

## Tech Stack

- **Backend**: Node.js, Express, MongoDB (Mongoose)
- **Frontend**: React 19, Vite, CSS Modules
- **Styling**: Modern design system with CSS custom properties

## Non-Goals (out of scope)

- Multi-user / authentication
- Storage location / rack management
- Barcode or label scanning
- External wine database integration
- Consumption history / drinking log
- Drink-window alerts or notifications
- Mobile-native app
