import React, { useState, useRef } from 'react';
import Overlay from 'react-overlays/lib/Overlay';
import { isMobile } from 'soapbox/is_mobile';
import ColorPicker from './color-picker';
const ColorWithPicker = ({
  buttonId,
  value,
  onChange
}) => {
  const node = useRef(null);
  const [active, setActive] = useState(false);
  const [placement, setPlacement] = useState(null);
  const hidePicker = () => {
    setActive(false);
  };
  const showPicker = () => {
    setActive(true);
    setPlacement(isMobile(window.innerWidth) ? 'bottom' : 'right');
  };
  const onToggle = e => {
    if (active) {
      hidePicker();
    } else {
      showPicker();
    }
    e.stopPropagation();
  };
  return <div>
      <div ref={node} id={buttonId} className='w-8 h-8 rounded-md' role='presentation' style={{
      background: value
    }} title={value} onClick={onToggle} />

      <Overlay show={active} placement={placement} target={node.current}>
        <ColorPicker value={value} onChange={onChange} onClose={hidePicker} />
      </Overlay>
    </div>;
};
export default ColorWithPicker;