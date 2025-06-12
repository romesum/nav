# Navigation Site

A modern navigation site built with Next.js, Supabase, and NextAuth.js.

## Features

- User authentication with GitHub and Google
- Modern, responsive design
- Card-based navigation layout
- Hierarchical category system
- Real-time search functionality
- Clean and sophisticated UI

## Prerequisites

- Node.js 14.x or later
- npm or yarn
- Supabase account
- GitHub OAuth credentials
- Google OAuth credentials

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# NextAuth.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret

# GitHub OAuth
GITHUB_ID=your-github-client-id
GITHUB_SECRET=your-github-client-secret

# Google OAuth
GOOGLE_ID=your-google-client-id
GOOGLE_SECRET=your-google-client-secret

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd <repository-name>
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── src/
│   ├── pages/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   └── bookmarks.ts
│   │   ├── _app.tsx
│   │   └── nav/
│   │       └── index.tsx
│   ├── styles/
│   │   └── globals.css
│   └── types/
│       └── next-auth.d.ts
├── public/
│   └── images/
├── .env.local
├── next.config.js
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── tsconfig.json
```

## Technologies Used

- Next.js
- TypeScript
- Tailwind CSS
- NextAuth.js
- Supabase
- Lucide React Icons

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
