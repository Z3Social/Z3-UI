import { supportsPassiveEvents } from 'detect-passive-events';
import React, { useEffect, useRef } from 'react';
import { SketchPicker } from 'react-color';
import { isMobile } from 'soapbox/is_mobile';
const listenerOptions = supportsPassiveEvents ? {
  passive: true
} : false;
const ColorPicker = ({
  style,
  value,
  onClose,
  onChange
}) => {
  const node = useRef(null);
  const handleDocumentClick = e => {
    if (node.current && !node.current.contains(e.target)) {
      onClose();
    }
  };
  useEffect(() => {
    document.addEventListener('click', handleDocumentClick, false);
    document.addEventListener('touchend', handleDocumentClick, listenerOptions);
    return () => {
      document.removeEventListener('click', handleDocumentClick, false);
      document.removeEventListener('touchend', handleDocumentClick);
    };
  }, []);
  const pickerStyle = {
    ...style,
    marginLeft: isMobile(window.innerWidth) ? '20px' : '12px',
    position: 'absolute',
    zIndex: 1000
  };
  return <div id='SketchPickerContainer' ref={node} style={pickerStyle}>
      <SketchPicker color={value} disableAlpha onChange={onChange} />
    </div>;
};
export default ColorPicker;