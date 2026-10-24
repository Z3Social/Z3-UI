import classNames from 'classnames';
import React, { useState, useRef } from 'react';
import { FormattedMessage } from 'react-intl';
import { v4 as uuidv4 } from 'uuid';
import { Text, Select } from '../../components/ui';
export const InputContainer = props => {
  const containerClass = classNames('input', {
    'with_label': props.label,
    'required': props.required,
    'boolean': props.type === 'checkbox',
    'field_with_errors': props.error
  }, props.extraClass);
  return <div className={containerClass}>
      {props.children}
      {props.hint && <span className='hint'>{props.hint}</span>}
    </div>;
};
export const LabelInputContainer = ({
  label,
  hint,
  children
}) => {
  const [id] = useState(uuidv4());
  const childrenWithProps = React.Children.map(children, child =>
  React.cloneElement(child, {
    id: id,
    key: id
  }));
  return <div className='label_input'>
      <label htmlFor={id}>{label}</label>
      <div className='label_input__wrapper'>
        {childrenWithProps}
      </div>
      {hint && <span className='hint'>{hint}</span>}
    </div>;
};
export const LabelInput = ({
  label,
  ...props
}) => <LabelInputContainer label={label}>
    <input {...props} />
  </LabelInputContainer>;
export const LabelTextarea = ({
  label,
  ...props
}) => <LabelInputContainer label={label}>
    <textarea {...props} />
  </LabelInputContainer>;
export const SimpleInput = props => {
  const {
    hint,
    error,
    ...rest
  } = props;
  const Input = props.label ? LabelInput : 'input';
  return <InputContainer {...props}>
      <Input {...rest} />
    </InputContainer>;
};
export const SimpleTextarea = props => {
  const {
    hint,
    label,
    ...rest
  } = props;
  const Input = label ? LabelTextarea : 'textarea';
  return <InputContainer {...props}>
      <Input {...rest} />
    </InputContainer>;
};
export const SimpleForm = props => {
  const {
    className,
    children,
    onSubmit = () => {},
    acceptCharset = 'UTF-8',
    ...rest
  } = props;
  const handleSubmit = e => {
    onSubmit(e);
    e.preventDefault();
  };
  return <form className={classNames('simple_form', className)} method='post' onSubmit={handleSubmit} acceptCharset={acceptCharset} {...rest}>
      {children}
    </form>;
};
export const FieldsGroup = ({
  children
}) => <div className='fields-group'>{children}</div>;
export const Checkbox = props => <SimpleInput type='checkbox' {...props} />;
export const RadioGroup = props => {
  const {
    label,
    children,
    onChange
  } = props;
  const childrenWithProps = React.Children.map(children, child =>
  React.cloneElement(child, {
    onChange
  }));
  return <div className='input with_floating_label radio_buttons'>
      <div className='label_input'>
        <label>{label}</label>
        <ul>{childrenWithProps}</ul>
      </div>
    </div>;
};
export const RadioItem = props => {
  const {
    current: id
  } = useRef(uuidv4());
  const {
    label,
    hint,
    checked = false,
    ...rest
  } = props;
  return <li className='radio'>
      <label htmlFor={id}>
        <input id={id} type='radio' checked={checked} {...rest} />
        <Text>{label}</Text>
        {hint && <span className='hint'>{hint}</span>}
      </label>
    </li>;
};
export const SelectDropdown = props => {
  const {
    label,
    hint,
    items,
    ...rest
  } = props;
  const optionElems = Object.keys(items).map(item => <option key={item} value={item}>{items[item]}</option>);

  const selectElem = <Select {...rest}>{optionElems}</Select>;
  return label ? <LabelInputContainer label={label} hint={hint}>{selectElem}</LabelInputContainer> : selectElem;
};
export const TextInput = props => <SimpleInput type='text' {...props} />;
export const FileChooser = props => <SimpleInput type='file' {...props} />;
FileChooser.defaultProps = {
  accept: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
};
export const FileChooserLogo = props => <SimpleInput type='file' {...props} />;
FileChooserLogo.defaultProps = {
  accept: ['image/svg', 'image/png']
};
export const CopyableInput = ({
  value
}) => {
  const node = useRef(null);
  const handleCopyClick = () => {
    if (!node.current) return;
    node.current.select();
    node.current.setSelectionRange(0, 99999);
    document.execCommand('copy');
  };
  return <div className='copyable-input'>
      <input ref={node} type='text' value={value} readOnly />
      <button className='p-2 text-white bg-primary-600' onClick={handleCopyClick}>
        <FormattedMessage id='forms.copy' defaultMessage='Copy' />
      </button>
    </div>;
};