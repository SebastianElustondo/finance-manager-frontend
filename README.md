# Finance Manager Frontend

A modern, responsive web application built with Next.js 14, React, and TypeScript for managing financial portfolios and tracking investments.

## Features

- **Modern UI/UX** with Tailwind CSS and responsive design
- **Authentication** with Supabase Auth
- **Real-time updates** via WebSocket connections
- **PWA support** for desktop notifications
- **Portfolio management** with comprehensive analytics
- **Asset tracking** across multiple asset classes
- **Price alerts** and notifications
- **Interactive charts** with Recharts
- **TypeScript** for type safety
- **Server-side rendering** with Next.js 14

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Headless UI, Heroicons
- **Charts**: Recharts
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL
- **Real-time**: WebSocket & Supabase Realtime
- **Animations**: Framer Motion

## Project Structure

```
src/
├── app/             # Next.js 14 App Router
│   ├── auth/        # Authentication pages
│   ├── dashboard/   # Dashboard pages
│   ├── globals.css  # Global styles
│   ├── layout.tsx   # Root layout
│   └── page.tsx     # Home page
├── components/      # React components
│   ├── ui/          # Reusable UI components
│   ├── charts/      # Chart components
│   ├── forms/       # Form components
│   └── layout/      # Layout components
├── hooks/           # Custom React hooks
├── lib/             # Utility libraries
│   ├── supabase.ts  # Supabase client
│   └── utils.ts     # Utility functions
├── types/           # TypeScript type definitions
└── utils/           # Helper functions
```

## Installation

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env.local` file in the root directory:

   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```

3. **Configure Supabase:**
   - Create a Supabase project
   - Set up the database schema (see Database Schema section)
   - Configure authentication settings

## Getting Started

### Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run type checking
npm run type-check

# Run linting
npm run lint
```

The application will be available at `http://localhost:3000`

### Production Build

```bash
# Build the application
npm run build

# Start production server
npm start
```

## Features Overview

### 🏠 Landing Page

- Modern, responsive design
- Feature highlights
- Call-to-action sections
- SEO optimized

### 🔐 Authentication

- User registration and login
- Email verification
- Password reset
- Protected routes

### 📊 Dashboard

- Portfolio overview
- Asset allocation charts
- Performance analytics
- Recent transactions

### 💼 Portfolio Management

- Create and manage multiple portfolios
- Add/edit/delete assets
- Track different asset types (stocks, crypto, bonds, etc.)
- Real-time price updates

### 📈 Analytics & Charts

- Portfolio performance over time
- Asset allocation pie charts
- Profit/loss calculations
- Historical price charts

### 🔔 Alerts & Notifications

- Price alerts
- Portfolio milestones
- Push notifications (PWA)
- Email notifications

### 📱 PWA Features

- Offline capability
- Desktop notifications
- App-like experience
- Installation prompts

## Environment Variables

| Variable                        | Description            | Default               |
| ------------------------------- | ---------------------- | --------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Supabase project URL   | -                     |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | -                     |
| `NEXT_PUBLIC_API_URL`           | Backend API URL        | http://localhost:3001 |

## Database Schema

The frontend expects the following database tables:

### Users

- Managed by Supabase Auth
- Additional user metadata stored in auth.users

### Portfolios

```sql
CREATE TABLE portfolios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  total_value DECIMAL(15,2) DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Assets

```sql
CREATE TABLE assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_id UUID REFERENCES portfolios(id) ON DELETE CASCADE,
  symbol TEXT NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  quantity DECIMAL(15,8) NOT NULL,
  purchase_price DECIMAL(15,2) NOT NULL,
  current_price DECIMAL(15,2) NOT NULL,
  purchase_date DATE NOT NULL,
  exchange TEXT,
  currency TEXT DEFAULT 'USD',
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Alerts

```sql
CREATE TABLE alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  symbol TEXT NOT NULL,
  type TEXT NOT NULL,
  condition DECIMAL(15,2) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  is_triggered BOOLEAN DEFAULT false,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  triggered_at TIMESTAMP
);
```

## PWA Configuration

The app includes PWA support with:

- Service worker for offline functionality
- Web app manifest
- Desktop installation
- Push notifications

### Installing as PWA

1. Visit the app in a supported browser
2. Look for the "Install" prompt
3. Click "Install" to add to desktop/homescreen

## Performance Optimizations

- **Next.js 14** with App Router for optimal performance
- **Image optimization** with Next.js Image component
- **Code splitting** for efficient loading
- **Static generation** where possible
- **Caching strategies** for API calls
- **Lazy loading** for components

## Security Features

- **Authentication** via Supabase Auth
- **Row Level Security** (RLS) in database
- **Input validation** and sanitization
- **CSRF protection** via Next.js
- **Environment variable** protection

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Run linting and type checking
6. Submit a pull request

## Deployment

### Vercel (Recommended)

```bash
# Deploy to Vercel
vercel deploy

# Configure environment variables in Vercel dashboard
```

### Other Platforms

- Netlify
- AWS Amplify
- Railway
- Render

## Troubleshooting

### Common Issues

1. **Supabase Connection**
   - Check environment variables
   - Verify Supabase URL and keys
   - Ensure database is accessible

2. **Build Errors**
   - Run `npm run type-check`
   - Check for TypeScript errors
   - Verify all dependencies are installed

3. **Authentication Issues**
   - Check Supabase Auth configuration
   - Verify email templates
   - Check redirect URLs

## License

This project is licensed under the MIT License.
