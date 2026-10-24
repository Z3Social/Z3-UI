import { Record as ImmutableRecord } from 'immutable';
import { DROPDOWN_MENU_OPEN, DROPDOWN_MENU_CLOSE } from '../actions/dropdown_menu';
const ReducerRecord = ImmutableRecord({
  openId: null,
  placement: null,
  keyboard: false
});
export default function dropdownMenu(state = ReducerRecord(), action) {
  switch (action.type) {
    case DROPDOWN_MENU_OPEN:
      return state.merge({
        openId: action.id,
        placement: action.placement,
        keyboard: action.keyboard
      });
    case DROPDOWN_MENU_CLOSE:
      return state.openId === action.id ? state.set('openId', null) : state;
    default:
      return state;
  }
}