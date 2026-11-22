# AGENTS.md — Smart Campus Room Availability Checker

Instructions for any coding agent working in this project. Read this file before you change
anything, and follow it over any general habit of yours.

## Project

A React + TypeScript page (Vite) that tells a student whether a campus room is free for a
requested time. The booking rule lives in `src/booking.ts` (`canBook`); the page is `src/App.tsx`;
the tests are in `src/booking.test.ts`.

Use one fictional room with sample bookings. Never use real timetables.

## Acceptance contract

- AC1 Reject start >= end and requests in the past.
- AC2 Enforce the maximum allowed duration (120 minutes).
- AC3 Reject a blocked room.
- AC4 Reject overlaps. Touching endpoints are allowed.
- AC5 Return Available / Unavailable without changing booking data.

## Commands

- Install: `npm install`
- Dev server: `npm run dev`
- Tests: `npx vitest run`
- Build: `npm run build`

## You may

- Edit only approved files; do not add dependencies without approval.
- Do not add login or databases.
- Never access or expose secrets.

## Before you finish

- Make sure the page still loads.
-- Run `npx vitest run` and `npm run build`. Tests must pass before proposing acceptance; report failures honestly.
- Never deploy externally; request review first.
