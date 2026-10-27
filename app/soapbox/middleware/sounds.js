'use strict';

/**
 * Middleware to handle sound actions.
 * UI sound effects are completely disabled to match X (which does not use UI sound effects).
 */
export default function soundsMiddleware() {
  return () => next => action => next(action);
}
