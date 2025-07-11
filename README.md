# HEK - Next.js Project

A modern Next.js application built with React 19, TypeScript, and Tailwind CSS.

## Features

- **Next.js 15** with Turbopack for fast development
- **React 19** with the latest features
- **TypeScript** for type safety
- **Tailwind CSS 4** for styling
- **Product showcase** with individual product pages
- **News section** for content management
- **Responsive design** with modern UI components

## Project Structure

```
hek/
├── app/                    # Next.js app directory
│   ├── (products)/        # Product routes
│   ├── news/              # News section
│   ├── products/          # Products listing
│   └── globals.css        # Global styles
├── components/            # Reusable components
│   ├── layout/           # Layout components
│   └── semantic/         # Semantic UI components
└── public/               # Static assets
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd hek
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Technologies Used

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **React**: 19.0.0
- **Build Tool**: Turbopack

## License

This project is private and proprietary.

## Code-Qualität & Tools

- **ESLint**: Linting für sauberen, konsistenten Code
- **Prettier**: Automatische Code-Formatierung
- **next-seo**: SEO-Defaults für bessere Auffindbarkeit
- **Vercel Analytics**: DSGVO-freundliche Besucherstatistiken

## Deployment auf Vercel

1. Repository mit GitHub verbinden
2. Auf [vercel.com](https://vercel.com/) einloggen
3. Projekt importieren und deployen (Vercel erkennt Next.js automatisch)
4. Analytics und Previews sind direkt aktiv
