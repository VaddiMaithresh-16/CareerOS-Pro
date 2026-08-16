import { motion } from 'framer-motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/**
 * SkeletonGrid — loading placeholders that pulse gently while results are loading.
 * Premium dark version aligned with the new design tokens.
 */
export default function SkeletonGrid({ count = 5 }) {
  const rows = Array.from({ length: count });
  const reducedMotion = useReducedMotion();

  return (
    <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
      {rows.map((_, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0.45, y: reducedMotion ? 0 : 6 }}
          animate={{ opacity: 0.8 }}
          transition={reducedMotion ? { repeat: Infinity, repeatType: 'reverse', duration: 0.2, delay: idx * 0.08 } : { repeat: Infinity, repeatType: 'reverse', duration: 1.1, delay: idx * 0.08 }}
          className="glass-card"
          style={{
            borderRadius: 'var(--r-3)',
            padding: 'var(--space-5)',
            display: 'flex',
            gap: 'var(--space-4)',
            height: 104,
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 'var(--r-2)',
              background: 'linear-gradient(110deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.10) 40%, rgba(255,255,255,0.04) 60%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 1.4s linear infinite',
              flexShrink: 0,
              animationPlayState: reducedMotion ? 'paused' : 'running',
            }}
          />
          <div style={{ flex: 1, display: 'grid', gap: 'var(--space-3)', alignContent: 'center', minWidth: 0 }}>
            <div
              style={{
                height: 14,
                width: '70%',
                borderRadius: '9999px',
                background: 'linear-gradient(110deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.09) 40%, rgba(255,255,255,0.04) 60%)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 1.4s linear infinite',
                animationPlayState: reducedMotion ? 'paused' : 'running',
              }}
            />
            <div
              style={{
                height: 12,
                width: '45%',
                borderRadius: '9999px',
                background: 'linear-gradient(110deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.07) 40%, rgba(255,255,255,0.04) 60%)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 1.4s linear infinite',
                animationPlayState: reducedMotion ? 'paused' : 'running',
              }}
            />
            <div
              style={{
                height: 10,
                width: '30%',
                borderRadius: '9999px',
                background: 'linear-gradient(110deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.06) 40%, rgba(255,255,255,0.04) 60%)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 1.4s linear infinite',
                animationPlayState: reducedMotion ? 'paused' : 'running',
              }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
}