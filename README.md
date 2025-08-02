# Portfolio v4 - Demaceo Vincent

A modern, performance-optimized portfolio website built with Next.js 15, showcasing professional experience, projects, and skills through an immersive, interactive digital experience with a unique oldschool Macintosh aesthetic.

## 🚀 Live Demo

Visit the live portfolio: [https://demaceo.com](https://demaceo.com)

## ✨ Features

### 🎨 Interactive Design

- **Retro-Modern UI/UX**: Unique blend of classic Macintosh System 7/Platinum aesthetics with modern functionality
- **Glass Morphism & Mac Classic**: Seamless integration of contemporary glass effects with nostalgic computing elements
- **Smooth Animations**: Powered by Framer Motion for seamless transitions and micro-interactions
- **Responsive Design**: Mobile-first approach, fully optimized for all device sizes
- **Accessibility**: WCAG compliant with proper ARIA labels and keyboard navigation

### 🚀 Performance Optimized

- **Feature-Based Architecture**: Organized components by business domain for better maintainability and scalability
- **Next.js 15**: Latest App Router with optimized image handling and asset management
- **TypeScript**: Full type safety and enhanced developer experience
- **Modular CSS**: Component-scoped styling with CSS modules and custom properties
- **Optimized Bundle Splitting**: Efficient code organization for faster load times

### 🎯 Core Sections

- **Interactive Home Screen**: Mac-inspired desktop interface with draggable windows and classic UI elements
- **About Me**: Personal introduction with interactive skill pills and animated tooltips
- **SkillsetModal**: Oldschool Macintosh-styled modal featuring services, tools, and principles
- **Project Gallery**: Animated showcase of current and archived work with modal presentations
- **Contact System**: Full modal contact form with EmailJS integration and floating contact button
- **Interactive Resume**: PDF-exportable resume with professional layout and download functionality

### 🛠️ Technical Highlights

- **Modern Stack**: Next.js 15.4.2 with App Router and React 19
- **Nostalgic Aesthetics**: Authentic Mac System 7 design language with classic fonts and UI patterns
- **Performance**: Optimized images, lazy loading, and efficient bundle splitting
- **Developer Experience**: ESLint, TypeScript, and feature-based modular architecture
- **SEO Ready**: Proper meta tags, structured data, and optimized routing

## 🔧 Tech Stack

### Core Technologies

- **Framework**: Next.js 15.4.2 with App Router
- **Language**: TypeScript 5
- **UI Library**: React 19.1.0
- **Styling**: CSS Modules with custom CSS variables and animations
- **Animation**: Framer Motion 12.23.6

### Key Dependencies

- **Icons**: FontAwesome (brands & solid icons)
- **Email**: EmailJS Browser 4.4.1 for contact form integration
- **PDF Generation**: html2canvas + jsPDF for resume downloads
- **Build Tool**: Next.js with Turbopack for faster development

### Development Tools

- **Linting**: ESLint with Next.js configuration
- **Styling**: Tailwind CSS 4 (configured)
- **Package Manager**: npm

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ (recommended: 20+)
- npm, yarn, pnpm, or bun

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/demaceo/portfolio-v4.git
   cd portfolio-v4
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Environment Setup** _(optional)_

   ```bash
   # Create .env.local for EmailJS integration
   NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
   NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
   NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
   ```

4. **Start development server**

   ```bash
   npm run dev
   # Uses Turbopack for faster builds
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎨 Design Philosophy

### Retro-Modern Aesthetic

This portfolio uniquely blends nostalgic computing aesthetics with modern web technologies:

- **Classic Mac System 7/Platinum UI**: Authentic oldschool Macintosh design language with proper gradients, inset/outset borders, and classic typography (Chicago, Geneva, Charcoal fonts)
- **Glass Morphism**: Contemporary design elements with backdrop blur effects and translucent surfaces
- **Seamless Integration**: Thoughtful combination of retro and modern elements that feels both familiar and fresh

### Component Architecture

The application follows a **feature-based architecture** for optimal maintainability:

- **Domain-Driven Organization**: Components grouped by business domain rather than technical type
- **Barrel Exports**: Clean import statements using index.ts files for better developer experience
- **TypeScript Path Mapping**: Intuitive import aliases (`@/features/*`, `@/data/*`, `@/lib/*`)
- **Modular CSS**: Component-scoped styling with CSS modules preventing style conflicts

## 🚧 Recent Improvements

### File Structure Optimization (v4.1)

- **Migrated to Feature-Based Architecture**: Reorganized all components by business domain
- **Improved Import Paths**: Updated TypeScript path mappings for better developer experience
- **Enhanced Maintainability**: Clear separation of concerns with logical component grouping
- **Better Scalability**: Structure ready for future feature additions

### UI/UX Enhancements

- **SkillsetModal Redesign**: Complete transformation to authentic oldschool Macintosh aesthetic
- **Contact Form Modal**: Converted to full modal experience with backdrop interaction
- **Enhanced AboutMePills**: Modern pill design with improved visual hierarchy
- **Classic Mac Window Controls**: Authentic System 7 window elements with proper interaction states

## 🛠️ Development Guidelines

### Adding New Features

1. **Create feature directory** in `src/components/features/`
2. **Add barrel export** in feature's `index.ts`
3. **Update TypeScript paths** if needed in `tsconfig.json`
4. **Follow naming conventions** with PascalCase for components

### Styling Approach

- **CSS Modules**: Use `.module.css` for component-specific styles
- **CSS Variables**: Leverage custom properties for consistent theming
- **Responsive Design**: Mobile-first approach with progressive enhancement
- **Classic Mac Elements**: Maintain authentic System 7 design patterns where applicable

## 📁 Project Structure

```
portfolio-v4/
├── .env.local                        # Environment variables
├── .gitignore                        # Git ignore rules
├── package.json                      # Dependencies and scripts
├── next.config.ts                    # Next.js configuration
├── tsconfig.json                     # TypeScript configuration
├── README.md                         # Project documentation
│
├── public/                           # Static assets
│   ├── icons/                        # Service/feature icons
│   ├── images/                       # Static images and media
│   ├── logos/                        # Brand logos and assets
│   └── projects/                     # Project screenshots
│
└── src/                              # Source code
    ├── app/                          # Next.js App Router
    │   ├── layout.tsx                # Root layout component
    │   ├── page.tsx                  # Home page
    │   ├── globals.css               # Global styles and variables
    │   ├── loading.tsx               # Loading UI
    │   ├── error.tsx                 # Error UI
    │   ├── not-found.tsx             # 404 page
    │   │
    │   ├── (routes)/                 # Route groups
    │   │   ├── desktop/              # Desktop view route
    │   │   │   └── page.tsx
    │   │   ├── mobile/               # Mobile view route
    │   │   │   └── page.tsx
    │   │   └── project/              # Dynamic project routes
    │   │       └── [id]/
    │   │           └── page.tsx
    │   │
    │   └── api/                      # API routes
    │       ├── contact/              # Contact form API
    │       │   └── route.ts
    │       └── health/               # Health check API
    │           └── route.ts
    │
    ├── components/                   # React components (Feature-organized)
    │   ├── features/                 # Business domain components
    │   │   ├── home/                 # Homepage functionality
    │   │   │   ├── HomeScreen/       # Main desktop interface
    │   │   │   └── index.ts          # Feature exports
    │   │   ├── contact/              # Contact functionality
    │   │   │   ├── ContactForm/      # Modal contact form
    │   │   │   ├── FloatingContactButton/ # Floating CTA
    │   │   │   └── index.ts          # Feature exports
    │   │   ├── skills/               # Skills and services
    │   │   │   ├── SkillsetModal/    # Mac-styled skills modal
    │   │   │   ├── ServiceCard/      # Service display cards
    │   │   │   └── index.ts          # Feature exports
    │   │   ├── portfolio/            # Project portfolio
    │   │   │   ├── ProjectCard/      # Individual project cards
    │   │   │   ├── ProjectsModal/    # Projects overview modal
    │   │   │   └── index.ts          # Feature exports
    │   │   ├── about/                # About section
    │   │   │   ├── AboutMeModal/     # About modal component
    │   │   │   └── index.ts          # Feature exports
    │   │   └── resume/               # Resume functionality
    │   │       ├── InteractiveResume/ # PDF-exportable resume
    │   │       └── index.ts          # Feature exports
    │   │
    │   ├── layout/                   # Layout components
    │   │   ├── DesktopLayout/        # Desktop-specific layout
    │   │   ├── MobileLayout/         # Mobile-specific layout
    │   │   └── index.ts              # Layout exports
    │   │
    │   ├── ui/                       # Reusable UI components
    │   │   ├── Layout/               # App-wide layout wrapper
    │   │   ├── NavBar/               # Navigation component
    │   │   └── index.ts              # UI exports
    │   │
    │   └── common/                   # Shared utilities
    │       ├── ErrorBoundary/        # Error handling
    │       ├── Loading/              # Loading states
    │       └── index.ts              # Common exports
    │
    ├── data/                         # Static data and content
    │   ├── projects.ts               # Project information
    │   ├── services.ts               # Service offerings
    │   ├── principles.ts             # Core principles
    │   ├── aboutMePills.ts           # About section data
    │   ├── timeline.ts               # Career timeline
    │   ├── navigation.ts             # Navigation data
    │   ├── DemaceoResume.tsx         # Resume structure
    │   └── index.ts                  # Data exports
    │
    ├── lib/                          # Utilities and configurations
    │   ├── constants/                # Application constants
    │   │   ├── paths.ts              # Asset and route paths
    │   │   ├── routes.ts             # Application routes
    │   │   └── index.ts              # Constants exports
    │   ├── utils/                    # Utility functions
    │   │   ├── formatting.ts         # Data formatting
    │   │   ├── validation.ts         # Input validation
    │   │   └── index.ts              # Utils exports
    │   ├── types/                    # TypeScript definitions
    │   │   ├── global.ts             # Global types
    │   │   ├── components.ts         # Component types
    │   │   └── index.ts              # Type exports
    │   └── services/                 # External service integrations
    │       ├── emailjs.ts            # Email service
    │       └── index.ts              # Service exports
    │
    ├── hooks/                        # Custom React hooks
    │   ├── useProjects.ts            # Project data hook
    │   ├── useScrollPosition.ts      # Scroll tracking hook
    │   └── index.ts                  # Hook exports
    │
    └── styles/                       # Global styles and themes
        ├── globals.css               # Global CSS variables
        ├── components.css            # Component-specific styles
        └── themes/                   # Theme variations
            ├── light.css             # Light theme
            └── dark.css              # Dark theme
```

│ ├── layout.tsx # Root layout with metadata
│ └── page.tsx # Homepage
├── public/ # Static assets (optimized for Next.js)
│ ├── icons/ # Service and project icons
│ ├── logo/ # Brand assets
│ └── bg/ # Background images
└── package.json # Dependencies and scripts

````

## 🎨 Key Components

### HomeScreen

Multi-mode landing experience with:

- **Interactive Design**: Engaging animations and micro-interactions
- **Easter Eggs**: Hidden functionality and quirky elements
- **Responsive Layout**: Adapts seamlessly across devices

### ServiceSpectrum

Interactive service showcase featuring:

- **Flip Animation**: Smooth hover/click transitions revealing details
- **Gradient Theming**: Consistent with app's visual design system
- **Mobile Optimization**: Touch-friendly interactions

### ProjectGallery

Professional project showcase with:

- **Framer Motion**: Scroll-triggered and hover animations
- **Category Filtering**: Current vs archived projects
- **External Integration**: GitHub and media assets
- **Performance**: Optimized image loading and lazy rendering

### InteractiveResume

Professional resume component with:

- **PDF Export**: Client-side PDF generation with html2canvas
- **Print Optimization**: Clean, professional layout
- **Dynamic Content**: Structured data-driven content

## 🌐 Deployment

### Build for Production

```bash
npm run build
npm start
````

### Recommended Platforms

- **Vercel** (optimal for Next.js)
- **Netlify**
- **AWS Amplify**
- **Railway**
- **DigitalOcean Apps**

### Environment Variables

```bash
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
```

## 🎛️ Customization

### Content Updates

- **Resume**: `/src/app/data/DemaceoResume.tsx`
- **Projects**: `/src/app/data/projects.ts`
- **Services**: `/src/app/data/services.ts`
- **About**: `/src/app/components/shared/AboutMe/AboutMe.tsx`

### Styling

- **Theme Colors**: CSS variables in `globals.css`
- **Fonts**: Import configuration in `layout.tsx`
- **Components**: Individual CSS modules per component
- **Responsive**: Mobile-first breakpoints

### Assets

- **Brand Assets**: `/public/logo/`
- **Icons**: `/public/icons/`
- **Images**: `/public/bg/`

## 🔧 Available Scripts

```bash
npm run dev          # Development server with Turbopack
npm run build        # Production build
npm run start        # Production server
npm run lint         # ESLint code quality check
```

## 🚀 Performance Features

- **Image Optimization**: Next.js Image component with lazy loading
- **Bundle Splitting**: Feature-based code organization
- **CSS Variables**: Dynamic theming without runtime overhead
- **Tree Shaking**: Optimized imports and unused code elimination
- **Modern Output**: ES2022+ for modern browsers

## 📱 Browser Support

- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile**: iOS Safari 14+, Chrome Mobile 90+
- **Features**: CSS Grid, Flexbox, CSS Variables, ES2022

## 🤝 Contributing

This is a personal portfolio project, but I welcome:

- **Bug Reports**: Found an issue? Please open an issue with details
- **Feature Suggestions**: Ideas for improvements are always appreciated
- **Code Reviews**: Feedback on architecture and implementation
- **Design Feedback**: Thoughts on the retro-modern aesthetic blend

## � Contact

### Demaceo Vincent

**Senior Full-Stack Developer & UI/UX Designer**

- 📧 Email: [hdemaceo@gmail.com](mailto:hdemaceo@gmail.com)
- 🌐 Portfolio: [https://demaceo.com](https://demaceo.com)
- 💼 LinkedIn: [linkedin.com/in/demaceovincent](https://linkedin.com/in/demaceovincent)
- � GitHub: [github.com/demaceo](https://github.com/demaceo)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team**: For the incredible framework and developer experience
- **Vercel**: For seamless deployment and hosting
- **FontAwesome**: For the comprehensive icon library
- **EmailJS**: For reliable email service integration
- **Apple/Mac OS Classic**: For the timeless design inspiration
- **Open Source Community**: For the countless libraries and tools that make this possible

---

**Built with ❤️ and nostalgia by Demaceo Vincent**

_Blending the charm of classic computing with the power of modern web technologies_
