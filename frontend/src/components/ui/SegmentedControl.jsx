import { motion } from 'framer-motion';
import { useRef } from 'react';
import { defaultSpring } from '../../utils/appleDesign';

/**
 * SegmentedControl — signature Apple control.
 * The selection pill slides between segments using a spring (interruptible §3),
 * starts from the live presentation value, and slides along the same path (§7).
 */
export default function SegmentedControl({ options, value, onChange, ariaLabel }) {
  const refs = useRef({});

  const activeIndex = Math.max(0, options.findIndex((o) => o.value === value));

  // Compute pill position from the active segment's measured box
  const getStyle = () => {
    const el = refs.current[value];
    if (!el) return { left: 0, width: 0 };
    return { left: el.offsetLeft, width: el.offsetWidth };
  };

  return (
    <div
      className="glass-card"
      role="radiogroup"
      aria-label={ariaLabel}
      style={{
        position: 'relative',
        display: 'inline-flex',
        borderRadius: 'var(--r-3)',
        padding: 3,
      }}
    >
      {/* Animated pill — layout projection handles position/size */}
      <motion.div
        layout
        transition={defaultSpring}
        style={{
          position: 'absolute',
          top: 3,
          bottom: 3,
          borderRadius: 'var(--r-1)',
          background: 'var(--color-accent)',
          boxShadow: 'var(--shadow-glow)',
          ...getStyle(),
        }}
      />
      {options.map((opt) => (
        <motion.button
          key={opt.value}
          ref={(el) => { refs.current[opt.value] = el; }}
          role="radio"
          aria-checked={opt.value === value}
          onClick={() => onChange(opt.value)}
          style={{
            position: 'relative',
            zIndex: 1,
            padding: '7px 18px',
            fontSize: '0.875rem',
            fontWeight: 500,
            color: opt.value === value ? 'var(--text-on-accent)' : 'var(--text-secondary)',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            transition: 'color 180ms ease',
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          transition={{ type: 'spring', bounce: 0, duration: 0.2 }}
        >
          {opt.label}
        </motion.button>
      ))}
    </div>
  );
}