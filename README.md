# Portfolio v4 - Demaceo Vincent

A modern, performance-optimized portfolio website built with Next.js 15, showcasing professional experience, projects, and skills through an immersive, interactive digital experience.

## 🚀 Live Demo

Visit the live portfolio: [https://demaceo.com](https://demaceo.com)

## ✨ Features

### 🎨 Interactive Design

- **Modern UI/UX**: Gradient-based design system with glass morphism effects
- **Smooth Animations**: Powered by Framer Motion for seamless transitions and micro-interactions
- **Responsive Design**: Mobile-first approach, fully optimized for all device sizes
- **Accessibility**: WCAG compliant with proper ARIA labels and keyboard navigation

### 🚀 Performance Optimized

- **Feature-Based Architecture**: Organized components by business domain for better maintainability
- **Next.js 15**: Latest App Router with optimized image handling and asset management
- **TypeScript**: Full type safety and enhanced developer experience
- **CSS Variables**: Dynamic theming system with consistent color palette

### 🎯 Core Sections

- **About Me**: Personal introduction with interactive skill pills and tooltips
- **Service Spectrum**: Interactive flip cards showcasing service offerings
- **Project Gallery**: Animated showcase of current and archived work
- **Skills & Principles**: Dynamic toolbelt and core values presentation
- **Interactive Resume**: PDF-exportable resume with professional layout
- **Contact Integration**: Floating contact button with EmailJS integration

### 🛠️ Technical Highlights

- **Modern Stack**: Next.js 15.4.2 with App Router and React 19
- **Performance**: Optimized images, lazy loading, and efficient bundle splitting
- **Developer Experience**: ESLint, TypeScript, and modular component architecture
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

## 📁 Project Structure

```
src/
├── app/
│   ├── components/                    # Component organization
│   │   ├── features/                  # Feature-based components
│   │   │   ├── contact/              # Contact functionality
│   │   │   │   ├── Contact/          # Main contact section
│   │   │   │   ├── ContactForm/      # Form component
│   │   │   │   └── FloatingContactButton/ # Floating CTA
│   │   │   ├── home/                 # Homepage components
│   │   │   │   ├── HomeScreen/       # Main landing interface
│   │   │   │   ├── QuirkyPopup/      # Interactive modals
│   │   │   │   └── RandomButton/     # Easter egg functionality
│   │   │   ├── projects/             # Project-related components
│   │   │   │   └── ProjectGallery/   # Animated project showcase
│   │   │   └── skills/               # Skills and services
│   │   │       ├── ServiceSpectrum/  # Service cards with flip animation
│   │   │       ├── Toolbelt/         # Skills ticker animation
│   │   │       └── PrinciplesList/   # Core principles display
│   │   ├── shared/                   # Shared across features
│   │   │   ├── AboutMe/              # Personal introduction
│   │   │   └── InteractiveResume/    # PDF-exportable resume
│   │   └── ui/                       # Pure UI components
│   │       ├── Layout/               # App-wide layout wrapper
│   │       └── NavBar/               # Navigation component
│   ├── data/                         # Data and content
│   │   ├── projects.ts               # Project information
│   │   ├── services.ts               # Service offerings
│   │   ├── principles.ts             # Core principles
│   │   ├── timeline.ts               # Career timeline
│   │   └── DemaceoResume.tsx         # Resume structure
│   ├── lib/                          # Utilities and types
│   │   ├── types.ts                  # TypeScript definitions
│   │   └── constants/                # App constants
│   ├── mindset/                      # About page route
│   ├── skillset/                     # Skills page route
│   ├── projects/                     # Projects page route
│   ├── project/[id]/                 # Dynamic project pages
│   ├── globals.css                   # Global styles and CSS variables
│   ├── layout.tsx                    # Root layout with metadata
│   └── page.tsx                      # Homepage
├── public/                           # Static assets (optimized for Next.js)
│   ├── icons/                        # Service and project icons
│   ├── logo/                         # Brand assets
│   └── bg/                           # Background images
└── package.json                      # Dependencies and scripts
```

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
```

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

This is a personal portfolio, but suggestions are welcome:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/improvement`)
3. Commit changes (`git commit -am 'Add improvement'`)
4. Push to branch (`git push origin feature/improvement`)
5. Create a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 📧 Contact

**Demaceo Vincent**

- 🌐 Portfolio: [demaceo.com](https://demaceo.com)
- 💼 LinkedIn: [linkedin.com/in/demaceo](https://linkedin.com/in/demaceo)
- 📧 Email: hdemaceo@gmail.com

---

Built with ❤️ using Next.js 15, TypeScript, and modern web technologies • Optimized for performance and accessibility
