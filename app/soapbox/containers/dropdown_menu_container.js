import { connect } from 'react-redux';
import { openDropdownMenu, closeDropdownMenu } from '../actions/dropdown_menu';
import { openModal, closeModal } from '../actions/modals';
import DropdownMenu from '../components/dropdown_menu';
import { isUserTouching } from '../is_mobile';
const mapStateToProps = state => ({
  isModalOpen: Boolean(state.modals.size && state.modals.last().modalType === 'ACTIONS'),
  dropdownPlacement: state.dropdown_menu.placement,
  openDropdownId: state.dropdown_menu.openId,
  openedViaKeyboard: state.dropdown_menu.keyboard
});
const mapDispatchToProps = (dispatch, {
  status,
  items
}) => ({
  onOpen(id, onItemClick, dropdownPlacement, keyboard) {
    dispatch(isUserTouching() ? openModal('ACTIONS', {
      status,
      actions: items,
      onClick: onItemClick
    }) : openDropdownMenu(id, dropdownPlacement, keyboard));
  },
  onClose(id) {
    dispatch(closeModal('ACTIONS'));
    dispatch(closeDropdownMenu(id));
  }
});
export default connect(mapStateToProps, mapDispatchToProps)(DropdownMenu);