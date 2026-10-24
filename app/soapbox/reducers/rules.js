import { RULES_FETCH_REQUEST, RULES_FETCH_SUCCESS } from '../actions/rules';
const initialState = {
  items: [],
  isLoading: false
};
export default function rules(state = initialState, action) {
  switch (action.type) {
    case RULES_FETCH_REQUEST:
      return {
        ...state,
        isLoading: true
      };
    case RULES_FETCH_SUCCESS:
      return {
        ...state,
        isLoading: false,
        items: action.payload
      };
    default:
      return state;
  }
}