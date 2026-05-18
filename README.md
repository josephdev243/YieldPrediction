# YPF - Yield Prediction & Farming

A modern web application for small-scale farmers to track crop yields, monitor weather patterns, and receive data-driven recommendations to optimize their farming practices.

## Overview

YPF empowers small-scale farmers with:

- **Yield Tracking**: Record and monitor crop yields across different seasons and fields
- **Weather Monitoring**: Real-time weather data and forecasts
- **Predictive Analytics**: Data-driven insights to predict and optimize farming practices
- **Smart Recommendations**: Personalized recommendations to improve farming outcomes

## Tech Stack

- **Frontend Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Project Structure

```
src/
├── App.tsx           # Main application component with all page sections
├── App.css          # Minimal CSS (styling via Tailwind utility classes)
├── main.tsx         # React entry point
├── index.css        # Tailwind CSS directives
└── assets/          # Images and static files
```

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run preview` - Preview the production build
- `npm run lint` - Run ESLint

## Features

### Landing Page

- **Header**: Navigation menu with responsive mobile menu
- **Hero Section**: Compelling headline with dashboard preview
- **Features Section**: 4 main features with descriptions
- **Statistics**: Key metrics showing platform impact
- **Footer**: Company information and links

### Dashboard Preview

- Total Yield tracker
- Active Crops counter
- Total Fields display
- Rainfall metrics
- Yield Trend chart
- Weather Overview

## Color Scheme

The application uses a green color palette to reflect the agricultural nature:

- **Primary Green**: `bg-green-600`, `bg-green-500`
- **Dark Green**: `bg-green-900`, `bg-green-800`
- **Light Green**: `bg-green-100`, `bg-green-300`

## Responsive Design

The application is fully responsive and works on:

- Desktop (1024px and up)
- Tablet (768px - 1023px)
- Mobile (< 768px)

## Future Enhancements

- User authentication and accounts
- Real crop yield input forms
- Integration with weather APIs
- Predictive analytics dashboard
- Mobile app version
- Multi-language support

## License

MIT License

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs["recommended-typescript"],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```
