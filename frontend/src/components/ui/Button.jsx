import { motion } from 'framer-motion';
import { defaultSpring } from '../../utils/appleDesign';

/**
 * Button with Apple-style instant press feedback.
 * Feedback lives on pointer-down (not release) per apple-design §1.
 * Uses framer-motion `whileTap` (spring-based) so it's interruptible (§3).
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  className = '',
  type = 'button',
  ...rest
}) {
  const sizeClass = size === 'lg' ? 'btn-lg' : size === 'sm' ? 'btn-sm' : '';
  return (
    <motion.button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`btn btn-${variant} ${sizeClass} ${className}`.trim()}
      initial={false}
      whileTap={disabled ? undefined : { scale: 0.96 }}
      whileHover={disabled ? undefined : { scale: 1.02 }}
      transition={defaultSpring}
      {...rest}
    >
      {children}
    </motion.button>
  );
}