import React from 'react';
import { Modal } from 'soapbox/components/ui';
const ComponentModal = ({
  onClose,
  component: Component,
  componentProps = {}
}) => <Modal onClose={onClose} title=''>
    <Component onClose={onClose} {...componentProps} />
  </Modal>;
export default ComponentModal;