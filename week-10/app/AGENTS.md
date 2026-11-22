# AGENTS.md — Smart Campus Room Availability Checker
# AGENTS.md вЂ” Smart Campus Room Availability Checker

Instructions for any coding agent working in this project. Read this file before changing anything.

## Project

A React + TypeScript page (Vite) that checks room availability.
The booking rule lives in `src/booking.ts` (`canBook`).
The page is `src/App.tsx`, and the tests are in `src/booking.test.ts`.

Use one fictional room with sample booking data. Do not use real timetables.

## Acceptance contract

- AC1 Reject start ≥ end and requests in the past.
- AC2 Enforce the maximum allowed duration (120 minutes).
- AC3 Reject a blocked room.
- AC4 Reject overlaps. Touching endpoints are allowed.
- AC5 Return Available / Unavailable without changing booking data.

Preserve AC1вЂ“AC6. Verify the exact AC6 requirement before changing related behavior.

## Commands

- Install: `npm install`
- Dev server: `npm run dev`
- Tests: `npx vitest run`
- Build: `npm run build`

## You may

- Edit only files approved for the task.
- Do not add dependencies, login, or a database without approval.
- Never access, commit, or expose secrets.

## Before you finish

- Make sure the page still loads.
- Run `npx vitest run` and `npm run build`. Tests must pass before proposing acceptance.
- Do not deploy externally. Request review before proposing acceptance.

