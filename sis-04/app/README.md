# Smart Campus Room Availability Checker

## Overview

This is a React and TypeScript application for checking room availability in a fictional campus.

Users can filter rooms by capacity and equipment and check whether a selected room is available for a requested time.

## Setup

Requirements: Node.js and npm.

```bash
npm install
```

## Run

Start the development server:

```bash
npm run dev
```

Open the local URL displayed in the terminal.

## Tests

Run all automated tests:

```bash
npx vitest run
```

## Production build

```bash
npm run build
```

## Project structure

- `src/rooms.ts` — fictional room catalog and types.
- `src/filter.ts` — capacity and equipment filtering.
- `src/booking.ts` — booking validation and availability checking.
- `src/App.tsx` — user interface.
- `src/booking.test.ts` — automated tests.

## Limitations

The application uses fictional data stored in memory. It does not save bookings or connect to a database.