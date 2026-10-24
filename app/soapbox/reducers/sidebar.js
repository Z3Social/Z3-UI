import { SIDEBAR_OPEN, SIDEBAR_CLOSE } from '../actions/sidebar';
const initialState = {
  sidebarOpen: false
};
export default function sidebar(state = initialState, action) {
  switch (action.type) {
    case SIDEBAR_OPEN:
      return {
        sidebarOpen: true
      };
    case SIDEBAR_CLOSE:
      return {
        sidebarOpen: false
      };
    default:
      return state;
  }
}