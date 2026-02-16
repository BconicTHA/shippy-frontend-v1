# Shippy Frontend v1

A modern shipping management application built with Next.js 14, featuring authentication, role-based dashboards, and shipment tracking capabilities.

## 🚀 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Authentication:** NextAuth.js
- **UI Components:** Custom component library built with Radix UI primitives
- **State Management:** React hooks and server components

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- Node.js 18.x or higher
- npm or yarn package manager
- Git

## 🛠️ Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd shippy-frontend-v1
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory with the following variables:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# API Configuration
NEXT_PUBLIC_API_URL=your-api-url-here

# Add other environment variables as needed
```

### 4. Run the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 📁 Project Structure

```
shippy-frontend-v1/
├── app/                          # Next.js App Router directory
│   ├── (auth)/                   # Authentication route group
│   │   ├── login/               # Login page
│   │   └── register/            # Registration page
│   ├── (main)/                  # Main application route group
│   │   ├── admin/               # Admin-only routes
│   │   │   └── dashboard/       # Admin dashboard
│   │   └── client/              # Client-only routes
│   │       ├── dashboard/       # Client dashboard
│   │       └── profile/         # User profile management
│   ├── api/                     # API routes
│   │   └── auth/                # NextAuth API routes
│   ├── constants/               # Application constants
│   ├── globals.css              # Global styles
│   └── layout.tsx               # Root layout
├── components/                   # React components
│   ├── profile/                 # Profile-related components
│   ├── shipment/                # Shipment-related components
│   ├── sidebar/                 # Navigation sidebars
│   └── ui/                      # Reusable UI components
├── lib/                         # Utility libraries
│   ├── fetcher.ts              # API fetching utilities
│   └── utils.ts                # Helper functions
├── services/                    # API service layer
│   ├── profile.service.ts      # Profile API calls
│   ├── register.service.ts     # Registration API calls
│   └── shipment.service.ts     # Shipment API calls
├── types/                       # TypeScript type definitions
│   ├── auth.type.ts            # Authentication types
│   ├── next-auth.d.ts          # NextAuth type extensions
│   ├── profile.type.ts         # Profile types
│   └── shipment.type.ts        # Shipment types
├── auth.ts                      # NextAuth configuration
├── middleware.ts                # Next.js middleware (route protection)
└── tailwind.config.ts          # Tailwind CSS configuration
```

## 🔑 Key Features

### Authentication

- User registration and login
- NextAuth.js integration
- Protected routes via middleware
- Role-based access control (Admin/Client)

### User Roles

#### Admin

- Access to admin dashboard
- Manage all shipments
- User management capabilities ( Not implemented)

#### Client

- Personal dashboard
- Profile management
- Shipment creation
- Shipment tracking

### Core Modules

1. **Profile Management**
   - View and edit user profile
   - Address CRUD operations
   - Modal-based interactions

2. **Shipment Management**
   - Create new shipments
   - View shipment history
   - Track shipment status

3. **Dashboard**
   - Role-specific dashboards
   - Overview of key metrics
   - Quick actions

## 🎨 UI Components

The project uses a custom component library located in `components/ui/`:

- **Forms:** Input, Textarea, Select, Checkbox, Label, Field
- **Feedback:** Alert, Badge, Dialog
- **Navigation:** Breadcrumb, Sidebar
- **Data Display:** Table, Card
- **Actions:** Button
- **Layout:** Separator

All components are built with accessibility in mind and use Tailwind CSS for styling.

## 🔧 Development Guidelines

### File Naming Conventions

- **Components:** PascalCase (e.g., `AddressModal.tsx`)
- **Services:** kebab-case with `.service.ts` suffix
- **Types:** kebab-case with `.type.ts` suffix
- **Pages:** lowercase with `.tsx` extension

### Route Groups

The project uses Next.js route groups for organization:

- `(auth)`: Public authentication pages
- `(main)`: Protected application pages

### Client vs Server Components

- Pages are Server Components by default
- Client-side interactivity is in separate `client.tsx` files
- Use `"use client"` directive only when necessary

### API Services

All API calls should go through the service layer in `services/`:

```typescript
// Example service usage
import { getProfile, updateProfile } from "@/services/profile.service";

const profile = await getProfile(userId);
await updateProfile(userId, updatedData);
```

## 🧪 Code Style

- Use TypeScript for type safety
- Follow ESLint configuration
- Use Prettier for code formatting
- Write meaningful commit messages

## 📝 Available Scripts

```bash
# Development
npm run dev          # Start development server

# Build
npm run build        # Create production build
npm run start        # Start production server

# Linting
npm run lint         # Run ESLint
```

## 🔐 Authentication Flow

1. User navigates to `/login` or `/register`
2. Credentials are validated via NextAuth
3. Session is created and stored
4. Middleware protects routes based on authentication status
5. Role-based access is enforced at the route level

## 🛣️ Routing Structure

```
/                          # Landing page
/login                     # Login page
/register                  # Registration page
/admin/dashboard           # Admin dashboard (protected)
/client                    # Client home (protected)
/client/dashboard          # Client dashboard (protected)
/client/profile            # User profile (protected)
```

## 🐛 Troubleshooting

### Common Issues

**Issue:** "Module not found" errors

- **Solution:** Run `npm install` to ensure all dependencies are installed

**Issue:** Authentication not working

- **Solution:** Check `.env.local` file and ensure all required variables are set

**Issue:** API calls failing

- **Solution:** Verify `NEXT_PUBLIC_API_URL` is correctly configured

**Issue:** Build errors

- **Solution:** Check for TypeScript errors with `npm run build`
