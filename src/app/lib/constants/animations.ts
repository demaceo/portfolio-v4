export const ANIMATION_VARIANTS = {
    fadeInUp: {
        initial: { opacity: 0, y: 50 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, ease: "easeOut" }
    },
    staggerContainer: {
        animate: {
            transition: {
                staggerChildren: 0.1
            }
        }
    },
    slideInRight: {
        initial: { opacity: 0, x: 100 },
        animate: { opacity: 1, x: 0 },
        transition: { duration: 0.8, ease: "easeOut" }
    }
} as const;
