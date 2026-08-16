import { motion } from 'framer-motion';
import { defaultSpring } from '../../utils/appleDesign';

/**
 * Translucent glass card — Apple material depth (§12).
 * Subtle hover elevation via spring; shadow deepens on dark surfaces.
 */
export default function Card({ children, className = '', interactive = false, onClick, ...rest }) {
  const Comp = interactive ? motion.button : motion.div;
  return (
    <Comp
      type={interactive ? 'button' : undefined}
      onClick={onClick}
      className={`glass-card ${className}`.trim()}
      style={{
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-5)',
        display: 'block',
        textAlign: 'left',
        width: '100%',
      }}
      initial={false}
      whileHover={interactive ? { y: -2, boxShadow: 'var(--shadow-lg)' } : undefined}
      whileTap={interactive ? { scale: 0.99 } : undefined}
      transition={defaultSpring}
      {...rest}
    >
      {children}
    </Comp>
  );
}