// import classNames from 'classnames';
import React from 'react';
import { HotKeys } from 'react-hotkeys';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { connect } from 'react-redux';
import { getSoapboxConfig } from 'soapbox/actions/soapbox';
import { EmojiSelector as RealEmojiSelector } from 'soapbox/components/ui';
const mapStateToProps = state => ({
  allowedEmoji: getSoapboxConfig(state).allowedEmoji
});
class EmojiSelector extends ImmutablePureComponent {
  constructor(...args) {
    super(...args);
    this.node = undefined;
    this.handleBlur = e => {
      const {
        focused,
        onUnfocus
      } = this.props;
      if (focused && (!e.currentTarget || !e.currentTarget.classList.contains('emoji-react-selector__emoji'))) {
        onUnfocus();
      }
    };
    this._selectPreviousEmoji = i => {
      if (!this.node) return;
      if (i !== 0) {
        const button = this.node.querySelector(`.emoji-react-selector__emoji:nth-child(${i})`);
        button?.focus();
      } else {
        const button = this.node.querySelector('.emoji-react-selector__emoji:last-child');
        button?.focus();
      }
    };
    this._selectNextEmoji = i => {
      if (!this.node) return;
      if (i !== this.props.allowedEmoji.size - 1) {
        const button = this.node.querySelector(`.emoji-react-selector__emoji:nth-child(${i + 2})`);
        button?.focus();
      } else {
        const button = this.node.querySelector('.emoji-react-selector__emoji:first-child');
        button?.focus();
      }
    };
    this.handleKeyDown = i => e => {
      const {
        onUnfocus
      } = this.props;
      switch (e.key) {
        case 'Tab':
          e.preventDefault();
          if (e.shiftKey) this._selectPreviousEmoji(i);else this._selectNextEmoji(i);
          break;
        case 'Left':
        case 'ArrowLeft':
          this._selectPreviousEmoji(i);
          break;
        case 'Right':
        case 'ArrowRight':
          this._selectNextEmoji(i);
          break;
        case 'Escape':
          onUnfocus();
          break;
      }
    };
    this.handleReact = emoji => () => {
      const {
        onReact,
        focused,
        onUnfocus
      } = this.props;
      onReact(emoji);
      if (focused) {
        onUnfocus();
      }
    };
    this.handlers = {
      open: () => {}
    };
    this.setRef = c => {
      this.node = c;
    };
  }
  render() {
    const {
      visible,
      focused,
      allowedEmoji,
      onReact
    } = this.props;
    return <HotKeys handlers={this.handlers}>
        {/*<div
          className={classNames('flex absolute bg-white dark:bg-slate-500 px-2 py-3 rounded-full shadow-md opacity-0 pointer-events-none duration-100 w-max', { 'opacity-100 pointer-events-auto z-[999]': visible || focused })}
          onBlur={this.handleBlur}
          ref={this.setRef}
         >
          {allowedEmoji.map((emoji, i) => (
            <button
              key={i}
              className='emoji-react-selector__emoji'
              onClick={this.handleReact(emoji)}
              onKeyDown={this.handleKeyDown(i)}
              tabIndex={(visible || focused) ? 0 : -1}
            >
              <Emoji emoji={emoji} />
            </button>
          ))}
         </div>*/}
        <RealEmojiSelector emojis={allowedEmoji.toArray()} onReact={onReact} visible={visible} focused={focused} />
      </HotKeys>;
  }
}
EmojiSelector.defaultProps = {
  onReact: () => {},
  onUnfocus: () => {},
  visible: false
};
export default connect(mapStateToProps)(EmojiSelector);