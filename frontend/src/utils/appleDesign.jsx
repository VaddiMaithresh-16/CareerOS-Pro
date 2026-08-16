// Apple Design Helper Functions
// Based on the principles from the apple-design skill

/**
 * Projects the resting position based on initial velocity and deceleration rate.
 * @param {number} initialVelocity - Velocity in pixels per second
 * @param {number} [decelerationRate=0.998] - Deceleration rate (0.998 for normal scroll, 0.99 for snappier)
 * @returns {number} Projected distance to travel
 */
export function project(initialVelocity, decelerationRate = 0.998) {
  return (initialVelocity / 1000) * decelerationRate / (1 - decelerationRate);
}

/**
 * Applies rubber-banding effect for soft boundaries.
 * @param {number} overshoot - How far past the boundary the user has dragged
 * @param {number} dimension - The dimension (width or height) of the boundary
 * @param {number} [constant=0.55] - Constant for the rubberband effect
 * @returns {number} The amount to move the element (less as overshoot increases)
 */
export function rubberband(overshoot, dimension, constant = 0.55) {
  return (overshoot * dimension * constant) / (dimension + constant * Math.abs(overshoot));
}

/**
 * Apple-style spring parameters for different interactions.
 * These map to Framer Motion's bounce and duration props.
 * 
 * Framer Motion maps:
 *   bounce -> damping ratio (0 = no bounce, 1 = very bouncy)
 *   duration -> response time in seconds
 * 
 * Apple's damping ratio and response:
 *   Move/reposition: damping 1.0 (critical), response 0.4s
 *   Rotation: damping 0.8, response 0.4s
 *   Drawer/sheet: damping 0.8, response 0.3s
 */
export const springPresets = {
  // Critically damped (no overshoot) - default for most UI
  gentle: { bounce: 0, duration: 0.4 },
  // Slight bounce for momentum-driven interactions
  gentleWithBounce: { bounce: 0.2, duration: 0.4 },
  // For drawers, sheets, modals
  drawer: { bounce: 0.2, duration: 0.3 },
  // For quick taps, toggles
  quick: { bounce: 0, duration: 0.25 },
  // For rotations
  rotation: { bounce: 0.2, duration: 0.4 }
};

/**
 * Converts Apple's damping ratio and response to Framer Motion bounce and duration.
 * Note: This is an approximation. Framer Motion's bounce is not exactly damping ratio.
 * 
 * @param {number} dampingRatio - Apple's damping ratio (0 to 1, where 1 is critical)
 * @param {number} response - Apple's response time in seconds
 * @returns {{bounce: number, duration: number}} Framer Motion props
 */
export function appleToFramerMotion(dampingRatio, response) {
  // Approximate mapping: higher dampingRatio -> lower bounce
  // We'll invert and scale so that dampingRatio 1.0 -> bounce 0, dampingRatio 0.8 -> bounce 0.2
  const bounce = Math.max(0, Math.min(1, (1 - dampingRatio) * 5)); // Scale factor 5 to get 0.2 at 0.8 damping
  return { bounce, duration: response };
}

// Default spring config for general UI (critically damped)
export const defaultSpring = { bounce: 0, duration: 0.4 };
