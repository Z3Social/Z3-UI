const DROPDOWN_MENU_OPEN = 'DROPDOWN_MENU_OPEN';
const DROPDOWN_MENU_CLOSE = 'DROPDOWN_MENU_CLOSE';
const openDropdownMenu = (id, placement, keyboard) => ({
  type: DROPDOWN_MENU_OPEN,
  id,
  placement,
  keyboard
});
const closeDropdownMenu = id => ({
  type: DROPDOWN_MENU_CLOSE,
  id
});
export { DROPDOWN_MENU_OPEN, DROPDOWN_MENU_CLOSE, openDropdownMenu, closeDropdownMenu };