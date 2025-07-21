# Portfolio v4 - Demaceo Vincent

A modern, interactive portfolio website built with Next.js 15, showcasing professional experience, projects, and skills through an immersive digital experience.

## 🚀 Live Demo

Visit the live portfolio: [https://demaceo.com](https://demaceo.com) _(or your deployed URL)_

## ✨ Features

### 🎨 Interactive Design

- **Dual Interface**: MacOS-inspired desktop view and iOS-style mobile experience
- **Smooth Animations**: Powered by Framer Motion for seamless transitions
- **Responsive Design**: Fully optimized for desktop, tablet, and mobile devices
- **Dark Theme**: Modern aesthetic with gradient backgrounds and glass morphism effects

### 📱 Multi-Platform Experience

- **Desktop Mode**: MacOS-style interface with menu bar, desktop icons, and windows
- **Mobile Mode**: iPhone-inspired home screen with app icons and dock navigation
- **Adaptive Layout**: Automatically detects device type and adjusts interface accordingly

### 🎯 Core Sections

- **Mindset**: Personal philosophy, values, and professional approach
- **Skillset**: Technical skills ticker, service offerings, and core principles
- **Projects**: Interactive gallery of current and archived work
- **Contact**: Integrated contact form with EmailJS for direct communication
- **Resume**: Interactive, downloadable PDF resume with export functionality

### 🛠️ Technical Highlights

- **Modern Stack**: Next.js 15 with App Router and TypeScript
- **Performance**: Optimized images, lazy loading, and efficient animations
- **Accessibility**: Semantic HTML, proper ARIA labels, and keyboard navigation
- **SEO Ready**: Proper meta tags, structured data, and optimized routing

## 🔧 Tech Stack

### Frontend

- **Framework**: Next.js 15.4.2 with App Router
- **Language**: TypeScript 5
- **Styling**: CSS Modules with custom animations
- **Icons**: FontAwesome (brands & solid icons)
- **Animations**: Framer Motion 12.23.6
- **Images**: Next.js Image optimization with external domain support

### Functionality

- **Email**: EmailJS for contact form integration
- **PDF Generation**: html2canvas + jsPDF for resume downloads
- **Responsive**: Mobile-first design with breakpoint optimization
- **Routing**: Next.js App Router with dynamic routes

### Development

- **Linting**: ESLint with Next.js configuration
- **Build Tool**: Next.js with Turbopack for faster development
- **Package Manager**: npm

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
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
   # or
   bun install
   ```

3. **Environment Setup** _(if needed)_

   ```bash
   # Create .env.local for any environment variables
   # Example: EmailJS configuration
   NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
   NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
   NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
   ```

4. **Start development server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/
│   ├── components/           # Reusable UI components
│   │   ├── AboutMe/         # Personal introduction and values
│   │   ├── Contact/         # Contact section and form integration
│   │   ├── ContactForm/     # Standalone contact form
│   │   ├── HomeScreen/      # Main landing interface (dual-mode)
│   │   ├── InteractiveResume/  # PDF-exportable resume
│   │   ├── Layout/          # App-wide layout wrapper
│   │   ├── NavBar/          # Navigation component
│   │   ├── PrinciplesList/  # Core principles display
│   │   ├── ProjectGallery/  # Animated project showcase
│   │   ├── QuirkyPopup/     # Interactive modal system
│   │   ├── RandomButton/    # Easter egg functionality
│   │   ├── ServiceSpectrum/ # Service offerings with flip cards
│   │   └── Toolbelt/        # Skills ticker animation
│   ├── utilities/           # Data and helper functions
│   │   ├── projectData.ts   # Project information and metadata
│   │   ├── servicesData.ts  # Service offerings data
│   │   ├── principlesData.ts # Core principles content
│   │   ├── timelineData.ts  # Career timeline information
│   │   └── DemaceoResume.tsx # Resume data structure
│   ├── mindset/            # About page route
│   ├── skillset/           # Skills and services page route
│   ├── projects/           # Projects gallery route
│   ├── contact/            # Contact page route
│   ├── project/[id]/       # Dynamic project detail pages
│   ├── globals.css         # Global styles and variables
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Home page
├── assets/
│   ├── icons/              # Service and project icons
│   ├── logo/               # Brand assets
│   └── bg/                 # Background images
└── public/                 # Static assets
```

## 🎨 Key Components

### HomeScreen

The centerpiece component that provides dual-interface experience:

- **Desktop Mode**: MacOS-inspired with menubar, desktop icons, and quirky interactions
- **Mobile Mode**: iOS-style home screen with app icons and bottom dock
- **Easter Eggs**: Hidden interactions in the desktop menu system

### ProjectGallery

Animated showcase of work with:

- **Framer Motion**: Scroll-triggered animations
- **Dual Categories**: Current and archived projects
- **External Images**: GitHub and Giphy integration
- **Responsive Cards**: Adaptive layout for all screen sizes

### ServiceSpectrum

Interactive service cards featuring:

- **Flip Animation**: Hover/click to reveal detailed descriptions
- **Icon Integration**: Custom service icons
- **Contact Integration**: Direct connection to contact form

### InteractiveResume

Full-featured resume component with:

- **PDF Export**: Browser-based PDF generation
- **Professional Layout**: Clean, printable design
- **Dynamic Content**: Pulls from structured data

## 🌐 Deployment

### Build for Production

```bash
npm run build
npm start
```

### Deployment Platforms

This project is optimized for deployment on:

- **Vercel** (recommended - built by Next.js creators)
- **Netlify**
- **AWS Amplify**
- **Railway**
- **DigitalOcean Apps**

### Environment Variables for Production

Set up these variables in your deployment platform:

```bash
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
```

## 🎛️ Customization

### Personal Data

Update your information in these files:

- `/src/app/utilities/DemaceoResume.tsx` - Resume content
- `/src/app/utilities/projectData.ts` - Project portfolio
- `/src/app/utilities/servicesData.ts` - Service offerings
- `/src/app/components/AboutMe/AboutMe.tsx` - Personal introduction

### Styling

- **Colors**: Update CSS custom properties in `globals.css`
- **Fonts**: Modify font imports in `layout.tsx`
- **Animations**: Adjust Framer Motion configs in component files
- **Responsive**: Update breakpoints in component CSS files

### Assets

Replace files in:

- `/src/assets/logo/` - Your brand assets
- `/src/assets/icons/` - Service/skill icons
- `/src/assets/bg/` - Background images

## 🔧 Scripts

```bash
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint for code quality
```

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

While this is a personal portfolio, suggestions and improvements are welcome! Feel free to:

1. Fork the repository
2. Create a feature branch
3. Submit a pull request

## 📧 Contact

**Demaceo Vincent**

- Portfolio: [https://demaceo.com](https://demaceo.com)
- LinkedIn: [https://linkedin.com/in/demaceo](https://linkedin.com/in/demaceo)
- Email: hdemaceo@gmail.com

---

Built with ❤️ using Next.js, TypeScript, and modern web technologies.
