# Buildly - AI Website Builder

A modern AI-powered website builder that generates complete websites from text prompts using Google's Gemini AI.

## Features

- 🤖 **AI Website Generation** - Generate complete websites from text descriptions
- 🔐 **Authentication** - Secure user authentication with Supabase
- 🎨 **Modern UI** - Beautiful, responsive interface with dark/light themes
- 💳 **Payments** - Stripe integration for premium features
- 📝 **Code Editor** - Monaco Editor for code editing and customization
- 👑 **Admin Panel** - Manage users, prompts, and payments

## Setup Instructions

### 1. Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Supabase Configuration (Required for Authentication)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Google AI Configuration (Required for Website Generation)
GOOGLE_AI_API_KEY=your_google_ai_api_key

# Stripe Configuration (Required for Payments)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

### 2. Supabase Setup

1. Go to [Supabase](https://supabase.com) and create a new project
2. In your project dashboard, go to Settings > API
3. Copy your Project URL and anon/public key
4. Update the `.env.local` file with your credentials

### 3. Google AI API Setup

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Update the `GOOGLE_AI_API_KEY` in your `.env.local` file

### 4. Stripe Setup (Optional)

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Get your publishable and secret keys from the API keys section
3. Set up webhooks for payment processing
4. Update the Stripe variables in your `.env.local` file

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Project Structure

```
src/
├── app/                 # Next.js app directory
│   ├── api/            # API routes
│   ├── dashboard/      # Dashboard pages
│   └── admin/          # Admin panel
├── components/         # Reusable components
├── contexts/          # React contexts
└── lib/               # Utility libraries
```

## API Endpoints

- `POST /api/generate` - Generate website from prompt
- `POST /api/auth/*` - Authentication endpoints
- `POST /api/payments/*` - Payment processing
- `GET /api/admin/*` - Admin panel endpoints

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details
