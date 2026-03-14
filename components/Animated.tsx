'use client'

import { motion, HTMLMotionProps, Transition, Variants } from 'framer-motion'
import { ReactNode } from 'react'

// --- Constants ---
const SPRING_TRANSITION: Transition = { 
  type: 'spring', 
  stiffness: 300, 
  damping: 30 
}

const FADE_TRANSITION: Transition = { 
  duration: 0.6, 
  ease: [0.33, 1, 0.68, 1] 
}

// --- Components ---

/**
 * FadeIn Component
 * Sophisticated entrance animation for single elements.
 */
export const FadeIn = ({ children, delay = 0, y = 20, ...props }: { children: ReactNode; delay?: number; y?: number } & HTMLMotionProps<'div'>) => (
  <motion.div
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-40px' }}
    transition={{ ...FADE_TRANSITION, delay } as Transition}
    {...props}
  >
    {children}
  </motion.div>
)

/**
 * StaggerContainer Component
 * Orchestrates staggered animations for children.
 */
export const StaggerContainer = ({ children, staggerDelay = 0.08, ...props }: { children: ReactNode; staggerDelay?: number } & HTMLMotionProps<'div'>) => (
  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: '-20px' }}
    variants={{
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: staggerDelay,
        }
      }
    } as Variants}
    {...props}
  >
    {children}
  </motion.div>
)

/**
 * StaggerItem Component
 * Pairs with StaggerContainer for premium list/grid entrances.
 */
export const StaggerItem = ({ children, ...props }: { children: ReactNode } & HTMLMotionProps<'div'>) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 15 },
      visible: { opacity: 1, y: 0, transition: FADE_TRANSITION }
    } as Variants}
    {...props}
  >
    {children}
  </motion.div>
)

/**
 * ScaleHover Component
 * Discrete, premium scale effect for buttons and cards.
 */
export const ScaleHover = ({ children, scale = 1.02, ...props }: { children: ReactNode; scale?: number } & HTMLMotionProps<'div'>) => (
  <motion.div
    whileHover={{ scale, y: -2 }}
    whileTap={{ scale: 0.98 }}
    transition={SPRING_TRANSITION}
    {...props}
  >
    {children}
  </motion.div>
)

/**
 * RevealSection Component
 * High-end reveal for marketing sections.
 */
export const RevealSection = ({ children, ...props }: { children: ReactNode } & HTMLMotionProps<'section'>) => (
  <motion.section
    initial={{ opacity: 0, scale: 0.98 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true, margin: '-100px' }}
    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] } as Transition}
    {...props}
  >
    {children}
  </motion.section>
)
