# HEK - Nachhaltige Energielösungen

Eine moderne Next.js-Anwendung für nachhaltige Energielösungen, die innovative Produkte wie Aeroleaf und Smartflower präsentiert.

## 🚀 Features

- **Moderne Tech-Stack**: Next.js 15, React 18, TypeScript
- **Performance-Optimiert**: Image Optimization, Security Headers
- **SEO-Optimiert**: Umfassende Metadata-Konfiguration
- **Code-Qualität**: ESLint, Prettier
- **Analytics**: Vercel Analytics für Besucher-Tracking
- **Form-Handling**: React Hook Form mit Zod-Validierung

## 📁 Projektstruktur

```
hek/
├── app/                    # Next.js App Router
│   ├── (products)/        # Produkt-Seiten (Route Groups)
│   ├── news/              # News-Bereich
│   ├── globals.css        # Globale Styles
│   ├── layout.tsx         # Root Layout
│   └── page.tsx           # Hauptseite
├── components/            # Wiederverwendbare Komponenten
│   ├── layout/           # Layout-Komponenten
│   └── semantic/         # Semantische Komponenten
└── public/               # Statische Assets
```

## 🛠️ Setup

### Voraussetzungen

- Node.js 18+ 
- npm oder yarn

### Installation

```bash
# Repository klonen
git clone <repository-url>
cd hek

# Dependencies installieren
npm install

# Entwicklungsserver starten
npm run dev
```

Die Anwendung ist dann unter `http://localhost:3000` verfügbar.

## 📝 Scripts

```bash
# Entwicklung
npm run dev              # Entwicklungsserver starten
npm run build           # Production Build
npm run start           # Production Server starten

# Code-Qualität
npm run lint            # ESLint ausführen
npm run lint:fix        # ESLint automatisch beheben
npm run format          # Prettier formatieren
npm run format:check    # Prettier prüfen
npm run type-check      # TypeScript prüfen

# Utilities
npm run clean           # Build-Ordner löschen
npm run check-all       # Alle Checks ausführen
```

## 🎨 Design-System

Das Projekt verwendet CSS Custom Properties für konsistentes Theming:

```css
:root {
  --primary-color: #007bff;
  --primary-dark: #0056b3;
  --secondary-color: #6c757d;
  /* ... weitere Variablen */
}
```

## 📦 Deployment

Das Projekt ist für Vercel optimiert:

1. Repository mit Vercel verbinden
2. Automatisches Deployment bei Push auf main
3. Preview Deployments für Pull Requests

## 🔧 Konfiguration

### Environment Variables

Erstellen Sie eine `.env.local` Datei:

```env
# Analytics (optional)
NEXT_PUBLIC_GA_ID=your-ga-id
```

### Next.js Konfiguration

Die `next.config.ts` enthält:
- Performance-Optimierungen
- Image Optimization
- Security Headers
- SEO Redirects

## 🤝 Contributing

1. Feature Branch erstellen: `git checkout -b feature/amazing-feature`
2. Änderungen committen: `git commit -m 'Add amazing feature'`
3. Branch pushen: `git push origin feature/amazing-feature`
4. Pull Request erstellen

## 📄 Lizenz

Dieses Projekt ist privat und nicht zur öffentlichen Nutzung bestimmt.

## 🆘 Support

Bei Fragen oder Problemen wenden Sie sich an das Entwicklungsteam.
