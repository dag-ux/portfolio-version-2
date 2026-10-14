import { motion } from 'framer-motion';

export default function AdminBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10" aria-hidden="true">
      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(currentColor 1px, transparent 1px),
            linear-gradient(90deg, currentColor 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Gradient orbs */}
      <motion.div
        className="absolute rounded-full blur-3xl bg-red-500/5 dark:bg-red-500/8"
        style={{ width: 500, height: 500, top: '-10%', right: '-10%' }}
        animate={{ x: [0, -60, 40, 0], y: [0, 50, -30, 0], scale: [1, 1.1, 0.95, 1] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute rounded-full blur-3xl bg-blue-500/5 dark:bg-blue-500/8"
        style={{ width: 400, height: 400, bottom: '-10%', left: '-10%' }}
        animate={{ x: [0, 70, -50, 0], y: [0, -40, 60, 0], scale: [1, 0.9, 1.1, 1] }}
        transition={{ duration: 35, delay: 2, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}
