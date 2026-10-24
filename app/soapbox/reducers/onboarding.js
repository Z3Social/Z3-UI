import { ONBOARDING_START, ONBOARDING_END } from 'soapbox/actions/onboarding';
const initialState = {
  needsOnboarding: false
};
export default function onboarding(state = initialState, action) {
  switch (action.type) {
    case ONBOARDING_START:
      return {
        ...state,
        needsOnboarding: true
      };
    case ONBOARDING_END:
      return {
        ...state,
        needsOnboarding: false
      };
    default:
      return state;
  }
}