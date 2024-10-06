# Zoom App Clone - Video Conferencing

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app). It is a Zoom app clone, offering video conferencing with essential functionalities like scheduling meetings, starting instant meetings, inviting participants to join, and viewing previously recorded meetings.

## Features

- **Schedule Meetings:** Plan and schedule video meetings in advance.
- **Instant Meetings:** Start an immediate meeting with just a click.
- **Invite Participants:** Easily invite others to join your meetings via unique meeting links.
- **View Recorded Meetings:** Access and review your previously recorded meetings.

## Video Client

This project integrates with [GetStream.io's](https://getstream.io) API to provide video streaming capabilities.

## Authentication

User authentication is managed using [Clerk](https://clerk.dev), which provides a seamless login experience. However, Clerk imposes restrictions on users from certain countries. If you encounter issues while signing up or signing in, we recommend using a VPN to bypass these restrictions.

## Getting Started

To run the project locally, first start the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the app in action.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - An interactive Next.js tutorial.

You can also check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - Your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is through the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme), created by the team behind Next.js.

Check out the official [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
