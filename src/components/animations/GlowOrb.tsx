'use client';

import { motion } from 'framer-motion';

interface GlowOrbProps {
  color?: string;
  size?: number;
  className?: string;
  delay?: number;
}

export default function GlowOrb({
  color = '#06b6d4',
  size = 300,
  className = '',
  delay = 0,
}: GlowOrbProps) {
  return (
    <motion.div
      className={`pointer-events-none absolute rounded-full ${className}`}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle, ${color}33 0%, ${color}11 40%, transparent 70%)`,
        filter: `blur(${size * 0.3}px)`,
      }}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.4, 0.7, 0.4],
        x: [0, 30, -20, 0],
        y: [0, -20, 15, 0],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: 'easeInOut',
        delay,
      }}
    />
  );
}
