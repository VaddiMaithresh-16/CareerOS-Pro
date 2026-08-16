/*! Modal — scrim dims background, sheet materializes (not just fades) per §12.
 * Enter/exit symmetric (slide up ↦ down) per §7 spatial consistency.
 * Spring carries momentum; interruptible per §3.
 */

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { springPresets } from '../../utils/appleDesign';

export default function Modal({ open, onClose, children, title }) {
  // Lock body scroll while open
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
  }, [open]);

  // Escape to dismiss
  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === 'Escape') onClose?.(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  const containerRef = useRef(null);

  // Focus trap: keep Tab within the modal while open
  useEffect(() => {
    if (!open) return;
    const root = containerRef.current;
    if (!root) return;
    const selector = 'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';
    const focusable = Array.from(root.querySelectorAll(selector));
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    const handleKey = (e) => {
      if (e.key !== 'Tab') return;
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', handleKey);
    // Move focus into the modal when it opens
    first.focus();
    return () => document.removeEventListener('keydown', handleKey);
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            padding: 'var(--space-4)',
          }}
        >
          {/* Scrim */}
          <div
            onClick={onClose}
            style={{ position: 'absolute', inset: 0, background: 'var(--color-scrim)', backdropFilter: 'blur(4px)' }}
          />
          {/* Sheet */}
          <motion.div
            initial={{ y: '100%', opacity: 0.4 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0.4 }}
            transition={springPresets.drawer}
            className="glass-card"
            role="dialog"
            aria-modal="true"
            aria-label={title}
            ref={containerRef}
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: 640,
              maxHeight: '85vh',
              overflowY: 'auto',
              borderRadius: 'var(--r-5) var(--r-5) var(--r-3) var(--r-3)',
              padding: 'var(--space-5)',
              boxShadow: 'var(--shadow-lg)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
              {title && <h2 className="section-title">{title}</h2>}
              <motion.button
                onClick={onClose}
                aria-label="Close"
                style={{
                  width: 30, height: 30, borderRadius: '50%',
                  background: 'var(--color-surface-hover)', color: 'var(--color-text-secondary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.1rem', lineHeight: 1,
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', bounce: 0.2, duration: 0.2 }}
              >
                ×
              </motion.button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}