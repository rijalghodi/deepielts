# Deep IELTS

AI-powered IELTS writing checker.

Deep IELTS is a free AI-powered IELTS writing checker, trained on over hundreds of real essays. It gives accurate score predictions and practical feedback, just like a real examiner.

## Features

- **Task 1 Academic & General Scoring** - Get band score breakdowns with AI-generated feedback and sample answers
- **Task 2 Scoring** - Instant essay analysis with detailed feedback on argument, structure, vocabulary, and grammar
- **Progress Tracking** - Monitor your improvement over time with performance analytics
- **Instant AI Feedback** - Receive examiner-like feedback within seconds
- **PDF Export** - Download feedback as formatted PDFs for offline study
- **Image Upload** - Upload charts and diagrams for Task 1 with automatic data extraction
- **Flexible Submissions** - Upload files, paste text, or write directly in the editor
- **User Accounts** - Save submissions, track progress, and access premium features

## Tech Stack

### Frontend

- **Next.js 15.3.5** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type-safe development
- **Tailwind CSS 4 + Shadcn UI** - Utility-first CSS framework
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **TanStack Query** - Data fetching and caching
- **Zustand** - State management
- **Recharts** - Data visualization

### Backend & Services

- **Firebase** - Authentication, Firestore database, and Cloud Storage
- **OpenAI API** - AI-powered essay analysis and feedback generation
- **Redis (ioredis)** - Rate limiting and caching
- **Resend** - Email service for verification codes
- **Paddle** - Payment processing and subscription management

### Infrastructure & Tools

- **Vercel** - Hosting and deployment
- **Sentry** - Error monitoring and performance tracking
- **Pino** - Structured logging
- **Sharp** - Image processing
- **md-to-pdf** - PDF generation from Markdown

### Development Tools

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Turbopack** - Fast bundler for development

## Installation

### Prerequisites

- Node.js 20+ and pnpm
- Firebase project with Authentication, Firestore, and Storage enabled
- Redis instance (local or cloud)
- OpenAI API key
- Paddle account (for payment processing)
- Resend API key (for email verification)
- Sentry account (optional, for error monitoring)

### Setup Steps

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd deepielts
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   Copy the example environment file:

   ```bash
   cp env-example .env.local
   ```

   Fill in all required environment variables in `.env.local`:
   - **App Configuration**: `NEXT_PUBLIC_BASE_URL`, `NEXT_PUBLIC_API_BASE_URL`
   - **Firebase**: All `NEXT_PUBLIC_FIREBASE_*` and `FIREBASE_ADMIN_*` variables
   - **JWT**: `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`
   - **Resend**: `RESEND_API_KEY`
   - **OpenAI**: `OPENAI_API_KEY`
   - **Redis**: `REDIS_URL`
   - **Paddle**: All `NEXT_PUBLIC_PADDLE_*` and `PADDLE_*` variables
   - **Sentry**: All `SENTRY_*` variables (optional)

4. **Run the development server**

   ```bash
   pnpm dev
   ```

   The app will be available at `http://localhost:3003`

5. **Build for production**
   ```bash
   pnpm build
   pnpm start
   ```

### Additional Setup

- **Firebase**: Configure Firebase Authentication (Email/Password or Google), set up Firestore security rules, and configure Cloud Storage buckets.
- **Redis**: Ensure Redis is running and accessible at the `REDIS_URL` you configured.
- **Paddle**: Set up products and pricing in your Paddle dashboard and configure webhooks.

## TODO:

- [] Fix export to docx
- [] Improve payment, make it robust
- [] Improve Sidebar UI
