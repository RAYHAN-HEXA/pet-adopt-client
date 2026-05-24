# Pet Adoption Platform - Client

A full-stack pet adoption platform built with Next.js, MongoDB, and Better Auth. Users can browse pets, submit adoption requests, and manage listings.

## Features

- User authentication with email/password and Google OAuth via Better Auth
- Browse all available pets with search, filter by species, and sort options
- View detailed pet profiles with adoption fee, health status, and description
- Submit adoption requests with pickup date and message
- Dashboard for pet owners to manage listings and handle adoption requests
- Approve/reject adoption requests with automatic adoption status updates
- Responsive design with dark/light theme toggle
- Real-time form validation and toast notifications
- Custom 404 page and loading states

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Authentication:** Better Auth with JWT
- **Styling:** Tailwind CSS, Framer Motion
- **State Management:** React Context
- **HTTP Client:** Axios
- **Notifications:** React Hot Toast

## NPM Packages

- better-auth - Authentication
- axios - HTTP client
- framer-motion - Animations
- mongodb - Database driver
- next - Framework
- react, react-dom - UI library
- react-hot-toast - Notifications
- react-icons - Icons
- react-spring - Animations
- @react-oauth/google - Google OAuth

## Getting Started

```bash
npm install
npm run dev
```

## Environment Variables

See `.env.local` for required environment variables.
