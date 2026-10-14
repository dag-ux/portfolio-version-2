import { motion } from 'framer-motion';

interface AnimatedBackgroundProps {
  variant?: 'default' | 'hero' | 'subtle';
}

export default function AnimatedBackground({ variant = 'default' }: AnimatedBackgroundProps) {
  const circles = [
    { size: 400, x: '10%', y: '10%', duration: 25, delay: 0, opacity: 0.15, color: '#ff0000' },
    { size: 300, x: '80%', y: '20%', duration: 30, delay: 2, opacity: 0.1, color: '#ff0000' },
    { size: 500, x: '70%', y: '70%', duration: 35, delay: 1, opacity: 0.08, color: '#ffffff' },
    { size: 250, x: '20%', y: '80%', duration: 28, delay: 3, opacity: 0.12, color: '#ff0000' },
    { size: 350, x: '50%', y: '40%', duration: 32, delay: 0, opacity: 0.06, color: '#ff4444' },
  ];

  const visibleCircles = variant === 'hero' ? circles : circles.slice(0, 3);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Animated circles */}
      {visibleCircles.map((circle, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-3xl"
          style={{
            width: circle.size,
            height: circle.size,
            left: circle.x,
            top: circle.y,
            backgroundColor: circle.color,
            opacity: circle.opacity,
          }}
          animate={{
            x: [0, 60, -40, 20, 0],
            y: [0, -50, 30, -30, 0],
            scale: [1, 1.15, 0.9, 1.05, 1],
          }}
          transition={{
            duration: circle.duration,
            delay: circle.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Radial fade */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40" />
    </div>
  );
}
