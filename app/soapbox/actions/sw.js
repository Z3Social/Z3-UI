/** Sets the ServiceWorker updating state. */
const SW_UPDATING = 'SW_UPDATING';

/** Dispatch when the ServiceWorker is being updated to display a loading screen. */
const setSwUpdating = isUpdating => ({
  type: SW_UPDATING,
  isUpdating
});
export { SW_UPDATING, setSwUpdating };