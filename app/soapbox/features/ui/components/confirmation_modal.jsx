import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Modal } from 'soapbox/components/ui';
import { SimpleForm, FieldsGroup, Checkbox } from 'soapbox/features/forms';
const ConfirmationModal = ({
  heading,
  message,
  confirm,
  onClose,
  onConfirm,
  secondary,
  onSecondary,
  onCancel,
  checkbox
}) => {
  const [checked, setChecked] = useState(false);
  const handleClick = () => {
    onClose('CONFIRM');
    onConfirm();
  };
  const handleSecondary = () => {
    onClose('CONFIRM');
    onSecondary();
  };
  const handleCancel = () => {
    onClose('CONFIRM');
    if (onCancel) onCancel();
  };
  const handleCheckboxChange = e => {
    setChecked(e.target.checked);
  };
  return <Modal title={heading} confirmationAction={handleClick} confirmationText={confirm} confirmationDisabled={checkbox && !checked} confirmationTheme='danger' cancelText={<FormattedMessage id='confirmation_modal.cancel' defaultMessage='Cancel' />} cancelAction={handleCancel} secondaryText={secondary} secondaryAction={onSecondary && handleSecondary}>
      <p className='text-gray-600 dark:text-gray-300'>{message}</p>

      <div className='mt-2'>
        {checkbox && <div className='confirmation-modal__checkbox'>
          <SimpleForm>
            <FieldsGroup>
              <Checkbox onChange={handleCheckboxChange} label={checkbox} checked={checked} />
            </FieldsGroup>
          </SimpleForm>
        </div>}
      </div>
    </Modal>;
};
export default ConfirmationModal;