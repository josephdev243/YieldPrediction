# YPF - Yield Prediction & Farming

## Project Overview

YPF is a React + TypeScript + Tailwind CSS frontend application for small-scale farmers to track crop yields, monitor weather patterns, and receive data-driven recommendations.

## Project Setup

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: React Hooks
- **UI Icons**: Lucide React

## Architecture

The application is built as a single-page application (SPA) with the following main sections:

### Components Structure

- **Header/Navigation**: Sticky navigation with mobile responsive menu
- **Hero Section**: Landing page hero with dashboard preview
- **Features Section**: Showcasing 4 main platform features
- **Statistics Section**: Key platform metrics
- **Footer**: Company information and links

All components are implemented in a single `App.tsx` file for simplicity.

## Development Guidelines

### Styling

- Use Tailwind CSS utility classes for all styling
- Color scheme: Green palette (green-900, green-800, green-700, green-600, green-500, etc.)
- No traditional CSS files needed - all styling via Tailwind
- Responsive breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)

### Component Development

- Keep components functional and use React Hooks
- Use TypeScript for type safety
- Leverage lucide-react for consistent icons
- Use emojis for visual elements where appropriate

### File Organization

```
src/
├── App.tsx              # Main component
├── main.tsx             # React entry point
├── index.css            # Tailwind directives
├── App.css              # Reserved for component-specific styles if needed
└── assets/              # Images and static files
```

## Common Tasks

### Starting Development Server

```bash
npm run dev
```

### Building for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Linting

```bash
npm run lint
```

## Design Considerations

- Mobile-first approach
- Fully responsive design (mobile, tablet, desktop)
- Accessibility best practices
- Fast load times with Vite

## Future Enhancements

When extending this project, consider:

1. Breaking down App.tsx into smaller reusable components
2. Adding React Router for multi-page navigation
3. Implementing state management (Context API or Redux)
4. Adding form validation for user inputs
5. Integrating backend APIs
6. Adding authentication
7. Implementing real-time weather data
8. Building predictive analytics features

## Preferred Packages for Future Development

- React Router - for client-side routing
- React Query/SWR - for data fetching
- Axios - for API calls
- Zod/Yup - for form validation
- Zustand/Context API - for state management
- React Testing Library - for testing

## Notes

- The project uses Tailwind CSS for styling - no need for traditional CSS
- All responsive design is handled through Tailwind's responsive utilities
- The dashboard preview in the hero section is a mockup - will be replaced with real data in the backend integration phase
- Currently, all features link to "#" - these should be updated when routing is implemented
