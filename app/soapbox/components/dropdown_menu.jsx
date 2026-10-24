import classNames from 'classnames';
import { supportsPassiveEvents } from 'detect-passive-events';
import React from 'react';
import { spring } from 'react-motion';
import Overlay from 'react-overlays/lib/Overlay';
import { withRouter } from 'react-router-dom';
import { IconButton, Counter } from 'soapbox/components/ui';
import SvgIcon from 'soapbox/components/ui/icon/svg-icon';
import Motion from 'soapbox/features/ui/util/optional_motion';
const listenerOptions = supportsPassiveEvents ? {
  passive: true
} : false;
let id = 0;
class DropdownMenu extends React.PureComponent {
  constructor(...args) {
    super(...args);
    this.state = {
      mounted: false
    };
    this.node = null;
    this.focusedItem = null;
    this.handleDocumentClick = e => {
      if (this.node && !this.node.contains(e.target)) {
        this.props.onClose();
      }
    };
    this.setRef = c => {
      this.node = c;
    };
    this.setFocusRef = c => {
      this.focusedItem = c;
    };
    this.handleKeyDown = e => {
      if (!this.node) return;
      const items = Array.from(this.node.getElementsByTagName('a'));
      const index = items.indexOf(document.activeElement);
      let element = null;
      switch (e.key) {
        case 'ArrowDown':
          element = items[index + 1] || items[0];
          break;
        case 'ArrowUp':
          element = items[index - 1] || items[items.length - 1];
          break;
        case 'Tab':
          if (e.shiftKey) {
            element = items[index - 1] || items[items.length - 1];
          } else {
            element = items[index + 1] || items[0];
          }
          break;
        case 'Home':
          element = items[0];
          break;
        case 'End':
          element = items[items.length - 1];
          break;
        case 'Escape':
          this.props.onClose();
          break;
      }
      if (element) {
        element.focus();
        e.preventDefault();
        e.stopPropagation();
      }
    };
    this.handleItemKeyPress = e => {
      if (e.key === 'Enter' || e.key === ' ') {
        this.handleClick(e);
      }
    };
    this.handleClick = e => {
      const i = Number(e.currentTarget.getAttribute('data-index'));
      const item = this.props.items[i];
      if (!item) return;
      const {
        action,
        to
      } = item;
      this.props.onClose();
      if (typeof action === 'function') {
        e.preventDefault();
        action(e);
      } else if (to) {
        e.preventDefault();
        this.props.history.push(to);
      }
    };
    this.handleMiddleClick = e => {
      const i = Number(e.currentTarget.getAttribute('data-index'));
      const item = this.props.items[i];
      if (!item) return;
      const {
        middleClick
      } = item;
      this.props.onClose();
      if (e.button === 1 && typeof middleClick === 'function') {
        e.preventDefault();
        middleClick(e);
      }
    };
    this.handleAuxClick = e => {
      if (e.button === 1) {
        this.handleMiddleClick(e);
      }
    };
  }
  componentDidMount() {
    document.addEventListener('click', this.handleDocumentClick, false);
    document.addEventListener('keydown', this.handleKeyDown, false);
    document.addEventListener('touchend', this.handleDocumentClick, listenerOptions);
    if (this.focusedItem && this.props.openedViaKeyboard) {
      this.focusedItem.focus({
        preventScroll: true
      });
    }
    this.setState({
      mounted: true
    });
  }
  componentWillUnmount() {
    document.removeEventListener('click', this.handleDocumentClick);
    document.removeEventListener('keydown', this.handleKeyDown);
    document.removeEventListener('touchend', this.handleDocumentClick);
  }
  renderItem(option, i) {
    if (option === null) {
      return <li key={`sep-${i}`} className='dropdown-menu__separator' />;
    }
    const {
      text,
      href,
      to,
      newTab,
      isLogout,
      icon,
      count,
      destructive
    } = option;
    return <li className={classNames('dropdown-menu__item truncate', {
      destructive
    })} key={`${text}-${i}`}>
        <a href={href || to || '#'} role='button' tabIndex={0} ref={i === 0 ? this.setFocusRef : null} onClick={this.handleClick} onAuxClick={this.handleAuxClick} onKeyPress={this.handleItemKeyPress} data-index={i} target={newTab ? '_blank' : undefined} data-method={isLogout ? 'delete' : undefined}>
          {icon && <SvgIcon src={icon} className='mr-3 h-5 w-5 flex-none' />}

          <span className='truncate'>{text}</span>

          {count ? <span className='ml-auto h-5 w-5 flex-none'>
              <Counter count={count} />
            </span> : null}
        </a>
      </li>;
  }
  render() {
    const {
      items,
      style,
      placement,
      arrowOffsetLeft,
      arrowOffsetTop
    } = this.props;
    const {
      mounted
    } = this.state;
    return <Motion defaultStyle={{
      opacity: 0,
      scaleX: 1,
      scaleY: 1
    }} style={{
      opacity: spring(1, {
        damping: 35,
        stiffness: 400
      }),
      scaleX: spring(1, {
        damping: 35,
        stiffness: 400
      }),
      scaleY: spring(1, {
        damping: 35,
        stiffness: 400
      })
    }}>
        {({
        opacity,
        scaleX,
        scaleY
      }) =>
      // It should not be transformed when mounting because the resulting
      // size will be used to determine the coordinate of the menu by
      // react-overlays
      <div className={`dropdown-menu ${placement}`} style={{
        ...style,
        opacity: opacity,
        transform: mounted ? `scale(${scaleX}, ${scaleY})` : undefined
      }} ref={this.setRef}>
            <div className={`dropdown-menu__arrow ${placement}`} style={{
          left: arrowOffsetLeft,
          top: arrowOffsetTop
        }} />
            <ul>
              {items.map((option, i) => this.renderItem(option, i))}
            </ul>
          </div>}
      </Motion>;
  }
}
DropdownMenu.defaultProps = {
  style: {},
  placement: 'bottom'
};
const RouterDropdownMenu = withRouter(DropdownMenu);
class Dropdown extends React.PureComponent {
  constructor(...args) {
    super(...args);
    this.state = {
      id: id++,
      open: false
    };
    this.target = null;
    this.activeElement = null;
    this.handleClick = e => {
      const {
        onOpen,
        onShiftClick,
        openDropdownId
      } = this.props;
      e.stopPropagation();
      if (onShiftClick && e.shiftKey) {
        e.preventDefault();
        onShiftClick(e);
      } else if (this.state.id === openDropdownId) {
        this.handleClose();
      } else if (onOpen) {
        const {
          top
        } = e.currentTarget.getBoundingClientRect();
        const placement = top * 2 < innerHeight ? 'bottom' : 'top';
        onOpen(this.state.id, this.handleItemClick, placement, e.type !== 'click');
      }
    };
    this.handleClose = () => {
      if (this.activeElement && this.activeElement === this.target) {
        this.activeElement.focus();
        this.activeElement = null;
      }
      if (this.props.onClose) {
        this.props.onClose(this.state.id);
      }
    };
    this.handleMouseDown = () => {
      if (!this.state.open) {
        this.activeElement = document.activeElement;
      }
    };
    this.handleButtonKeyDown = e => {
      switch (e.key) {
        case ' ':
        case 'Enter':
          this.handleMouseDown(e);
          break;
      }
    };
    this.handleKeyPress = e => {
      switch (e.key) {
        case ' ':
        case 'Enter':
          this.handleClick(e);
          e.stopPropagation();
          e.preventDefault();
          break;
      }
    };
    this.handleItemClick = e => {
      const i = Number(e.currentTarget.getAttribute('data-index'));
      const item = this.props.items[i];
      if (!item) return;
      const {
        action,
        to
      } = item;
      this.handleClose();
      e.preventDefault();
      e.stopPropagation();
      if (typeof action === 'function') {
        action(e);
      } else if (to) {
        this.props.history?.push(to);
      }
    };
    this.setTargetRef = c => {
      this.target = c;
    };
    this.findTarget = () => {
      return this.target;
    };
    this.componentWillUnmount = () => {
      if (this.state.id === this.props.openDropdownId) {
        this.handleClose();
      }
    };
  }
  render() {
    const {
      src = require('@tabler/icons/dots.svg'),
      items,
      title,
      disabled,
      dropdownPlacement,
      openDropdownId,
      openedViaKeyboard = false,
      pressed,
      text,
      children
    } = this.props;
    const open = this.state.id === openDropdownId;
    return <>
        {children ? React.cloneElement(children, {
        disabled,
        onClick: this.handleClick,
        onMouseDown: this.handleMouseDown,
        onKeyDown: this.handleButtonKeyDown,
        onKeyPress: this.handleKeyPress,
        ref: this.setTargetRef
      }) : <IconButton disabled={disabled} className={classNames({
        'text-gray-400 hover:text-gray-600': true,
        'text-gray-600': open
      })} title={title} src={src} aria-pressed={pressed} text={text} onClick={this.handleClick} onMouseDown={this.handleMouseDown} onKeyDown={this.handleButtonKeyDown} onKeyPress={this.handleKeyPress} ref={this.setTargetRef} />}

        <Overlay show={open} placement={dropdownPlacement} target={this.findTarget}>
          <RouterDropdownMenu items={items} onClose={this.handleClose} openedViaKeyboard={openedViaKeyboard} />
        </Overlay>
      </>;
  }
}
Dropdown.defaultProps = {
  title: 'Menu'
};
export default withRouter(Dropdown);