# Hologo V4 Dashboard

A modern dashboard application built with Next.js 15, TypeScript, Tailwind CSS, and shadcn/ui.

## Features

- 🔐 **Authentication**: NextAuth.js v5 with JWT tokens
- 🎨 **Modern UI**: shadcn/ui components with Tailwind CSS
- 📱 **Responsive Design**: Mobile-first approach
- 🔒 **Protected Routes**: Middleware-based route protection
- 🎯 **Type Safe**: Full TypeScript support

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Authentication**: NextAuth.js v5
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:

```bash
npm install
```

2. Set up environment variables:

Create a `.env.local` file in the root directory:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

To generate a secure `NEXTAUTH_SECRET`:

```bash
openssl rand -base64 32
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
hologo-v4-dashboard/
├── app/
│   ├── (auth)/
│   │   ├── login/          # Login page
│   │   └── register/       # Registration page
│   ├── (main)/             # Protected routes
│   ├── api/
│   │   └── auth/           # NextAuth API routes
│   ├── globals.css
│   └── layout.tsx
├── components/
│   └── ui/                 # shadcn/ui components
├── lib/
│   ├── fetcher.ts          # API fetcher utilities
│   └── utils.ts            # Utility functions
├── auth.ts                 # NextAuth configuration
└── middleware.ts           # Route protection middleware
```

## Authentication Flow

1. **Login**: Users can log in with email and password
2. **Registration**: New users can create an account
3. **Protected Routes**: Middleware protects routes in the `(main)` group
4. **JWT Tokens**: Sessions are managed via JWT tokens

## Available Routes

- `/login` - Login page
- `/register` - Registration page
- `/admin/dashboard` - Admin dashboard (protected)
- `/school/dashboard` - School dashboard (protected)

## Development

### Adding New Pages

1. Create a new folder in `app/(main)/`
2. Add `page.tsx` for the page component
3. Routes are automatically created based on folder structure

### Adding New UI Components

This project uses shadcn/ui. To add new components:

```bash
npx shadcn@latest add [component-name]
```

### Customizing Authentication

Edit `auth.ts` to customize the authentication logic:

- Add new providers
- Modify JWT callbacks
- Configure session settings

## Customization

### Theme

Edit `app/globals.css` to customize the color scheme and theme variables.

### Tailwind Configuration

Modify `tailwind.config.ts` to add custom colors, fonts, or extend the theme.

## Production Build

```bash
npm run build
npm start
```

## Notes

- The authentication is set up with a mock user for development
- Replace the mock authentication in `auth.ts` with your actual API endpoint
- Update the fetcher utility in `lib/fetcher.ts` with your API URL
- Add proper error handling and validation as needed

## License

MIT
