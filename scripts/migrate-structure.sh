#!/bin/bash

echo "🚀 Starting Portfolio Structure Migration..."

# Create new directory structure
echo "📁 Creating optimized directory structure..."
mkdir -p src/app/components/features/{contact,projects,skills,home}
mkdir -p src/app/components/{ui,shared}
mkdir -p src/app/lib/{utils,hooks,constants,types}
mkdir -p src/app/data
mkdir -p src/app/styles
mkdir -p public/{images,icons,logos}

# Move assets to public directory
echo "📦 Moving assets to public directory..."
if [ -d "src/assets" ]; then
  mv src/assets/logo/* public/logos/ 2>/dev/null || true
  mv src/assets/icons/* public/icons/ 2>/dev/null || true
  mv src/assets/bg/* public/images/ 2>/dev/null || true
  rmdir src/assets/logo src/assets/icons src/assets/bg 2>/dev/null || true
  rmdir src/assets 2>/dev/null || true
fi

# Move components to feature-based structure
echo "🔄 Reorganizing components by features..."

# Contact feature
mv src/app/components/ContactForm src/app/components/features/contact/ 2>/dev/null || true
mv src/app/components/FloatingContactButton src/app/components/features/contact/ 2>/dev/null || true
mv src/app/components/Contact src/app/components/features/contact/ 2>/dev/null || true

# Projects feature
mv src/app/components/ProjectGallery src/app/components/features/projects/ 2>/dev/null || true

# Skills feature
mv src/app/components/ServiceSpectrum src/app/components/features/skills/ 2>/dev/null || true
mv src/app/components/Toolbelt src/app/components/features/skills/ 2>/dev/null || true
mv src/app/components/PrinciplesList src/app/components/features/skills/ 2>/dev/null || true

# Home feature
mv src/app/components/HomeScreen src/app/components/features/home/ 2>/dev/null || true
mv src/app/components/QuirkyPopup src/app/components/features/home/ 2>/dev/null || true
mv src/app/components/RandomButton src/app/components/features/home/ 2>/dev/null || true

# UI components
mv src/app/components/Layout src/app/components/ui/ 2>/dev/null || true
mv src/app/components/NavBar src/app/components/ui/ 2>/dev/null || true

# Shared components
mv src/app/components/AboutMe src/app/components/shared/ 2>/dev/null || true
mv src/app/components/InteractiveResume src/app/components/shared/ 2>/dev/null || true
mv src/app/components/ErrorPage src/app/components/shared/ 2>/dev/null || true

# Move data files
echo "📊 Moving data files..."
mv src/app/utilities/projectData.ts src/app/data/projects.ts 2>/dev/null || true
mv src/app/utilities/servicesData.ts src/app/data/services.ts 2>/dev/null || true
mv src/app/utilities/timelineData.ts src/app/data/timeline.ts 2>/dev/null || true
mv src/app/utilities/principlesData.ts src/app/data/principles.ts 2>/dev/null || true

# Keep DemaceoResume.tsx in utilities for now as it's more of a utility
# mv src/app/utilities/DemaceoResume.tsx src/app/lib/utils/ 2>/dev/null || true

# Remove old directories if empty
rmdir src/app/utilities 2>/dev/null || true

echo "✅ Directory migration complete!"
