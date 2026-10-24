const ONBOARDING_START = 'ONBOARDING_START';
const ONBOARDING_END = 'ONBOARDING_END';
const ONBOARDING_LOCAL_STORAGE_KEY = 'soapbox:onboarding';
const checkOnboardingStatus = () => dispatch => {
  const needsOnboarding = localStorage.getItem(ONBOARDING_LOCAL_STORAGE_KEY) === '1';
  if (needsOnboarding) {
    dispatch({
      type: ONBOARDING_START
    });
  }
};
const startOnboarding = () => dispatch => {
  localStorage.setItem(ONBOARDING_LOCAL_STORAGE_KEY, '1');
  dispatch({
    type: ONBOARDING_START
  });
};
const endOnboarding = () => dispatch => {
  localStorage.removeItem(ONBOARDING_LOCAL_STORAGE_KEY);
  dispatch({
    type: ONBOARDING_END
  });
};
export { ONBOARDING_END, ONBOARDING_START, checkOnboardingStatus, endOnboarding, startOnboarding };