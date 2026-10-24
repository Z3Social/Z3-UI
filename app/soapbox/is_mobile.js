'use strict';

import { supportsPassiveEvents } from 'detect-passive-events';

/** Breakpoint at which the application is considered "mobile". */
const LAYOUT_BREAKPOINT = 630;

/** Check if the width is small enough to be considered "mobile". */
export function isMobile(width) {
  return width <= LAYOUT_BREAKPOINT;
}

/** Whether the device is iOS (best guess). */
const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
let userTouching = false;
const listenerOptions = supportsPassiveEvents ? {
  passive: true
} : false;
function touchListener() {
  userTouching = true;
  window.removeEventListener('touchstart', touchListener, listenerOptions);
}
window.addEventListener('touchstart', touchListener, listenerOptions);

/** Whether the user has touched the screen since the page loaded. */
export function isUserTouching() {
  return userTouching;
}

/** Whether the device is iOS (best guess). */
export function isIOS() {
  return iOS;
}