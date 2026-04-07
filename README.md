# NeedFinder AI

NeedFinder AI is a Next.js shopping assistant that turns a natural-language request into ranked product recommendations. It uses Groq to parse intent and rank products, Serper to fetch shopping results, and Supabase for auth plus search history.

## Stack

- Next.js 14
- React 18
- Tailwind CSS
- Supabase
- Groq API
- Serper API

## Environment Variables

Create a local `.env` file with:

```bash
NEXT_PUBLIC_CONTACT_EMAIL="support@yourdomain.com"
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
GROQ_API_KEY="gsk_..."
SERPER_API_KEY="..."
```

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Deployment

This project is ready for Vercel. Add the same environment variables in your Vercel project settings before deploying.
