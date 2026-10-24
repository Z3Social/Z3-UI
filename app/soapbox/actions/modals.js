export const MODAL_OPEN = 'MODAL_OPEN';
export const MODAL_CLOSE = 'MODAL_CLOSE';

/** Open a modal of the given type */
export function openModal(type, props) {
  return {
    type: MODAL_OPEN,
    modalType: type,
    modalProps: props
  };
}

/** Close the modal */
export function closeModal(type) {
  return {
    type: MODAL_CLOSE,
    modalType: type
  };
}