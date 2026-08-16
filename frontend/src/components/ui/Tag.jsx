/**
 * Tag / chip — small categorical label.
 * Color mapped to category for type-safe styling (§16 grouping/mapping).
 */
const CLASSES = {
  blue: 'tag-blue',
  green: 'tag-green',
  orange: 'tag-orange',
  purple: 'tag-purple',
  pink: 'tag-pink',
  teal: 'tag-teal',
  red: 'tag-red',
  yellow: 'tag-yellow',
  neutral: 'tag',
};

export default function Tag({ children, color = 'neutral', dot = false, className = '' }) {
  const cls = CLASSES[color] || CLASSES.neutral;
  return (
    <span className={`${cls} ${className}`.trim()}>
      {dot && <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor', flexShrink: 0, opacity: 0.9 }} />}
      {children}
    </span>
  );
}