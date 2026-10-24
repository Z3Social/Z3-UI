import Portal from '@reach/portal';
import classNames from 'classnames';
import { List as ImmutableList } from 'immutable';
import React from 'react';
import ImmutablePureComponent from 'react-immutable-pure-component';
import AutosuggestEmoji from 'soapbox/components/autosuggest_emoji';
import Icon from 'soapbox/components/icon';
import AutosuggestAccount from 'soapbox/features/compose/components/autosuggest_account';
import { isRtl } from 'soapbox/rtl';
const textAtCursorMatchesToken = (str, caretPosition, searchTokens) => {
  let word;
  const left = str.slice(0, caretPosition).search(/\S+$/);
  const right = str.slice(caretPosition).search(/\s/);
  if (right < 0) {
    word = str.slice(left);
  } else {
    word = str.slice(left, right + caretPosition);
  }
  if (!word || word.trim().length < 3 || !searchTokens.includes(word[0])) {
    return [null, null];
  }
  word = word.trim().toLowerCase();
  if (word.length > 0) {
    return [left + 1, word];
  } else {
    return [null, null];
  }
};
export default class AutosuggestInput extends ImmutablePureComponent {
  constructor(...args) {
    super(...args);
    this.getFirstIndex = () => {
      return this.props.autoSelect ? 0 : -1;
    };
    this.state = {
      suggestionsHidden: true,
      focused: false,
      selectedSuggestion: this.getFirstIndex(),
      lastToken: null,
      tokenStart: 0
    };
    this.input = null;
    this.onChange = e => {
      const [tokenStart, token] = textAtCursorMatchesToken(e.target.value, e.target.selectionStart || 0, this.props.searchTokens);
      if (token !== null && this.state.lastToken !== token) {
        this.setState({
          lastToken: token,
          selectedSuggestion: 0,
          tokenStart
        });
        this.props.onSuggestionsFetchRequested(token);
      } else if (token === null) {
        this.setState({
          lastToken: null
        });
        this.props.onSuggestionsClearRequested();
      }
      if (this.props.onChange) {
        this.props.onChange(e);
      }
    };
    this.onKeyDown = e => {
      const {
        suggestions,
        menu,
        disabled
      } = this.props;
      const {
        selectedSuggestion,
        suggestionsHidden
      } = this.state;
      const firstIndex = this.getFirstIndex();
      const lastIndex = suggestions.size + (menu || []).length - 1;
      if (disabled) {
        e.preventDefault();
        return;
      }
      if (e.which === 229) {
        // Ignore key events during text composition
        // e.key may be a name of the physical key even in this case (e.x. Safari / Chrome on Mac)
        return;
      }
      switch (e.key) {
        case 'Escape':
          if (suggestions.size === 0 || suggestionsHidden) {
            document.querySelector('.ui')?.parentElement?.focus();
          } else {
            e.preventDefault();
            this.setState({
              suggestionsHidden: true
            });
          }
          break;
        case 'ArrowDown':
          if (!suggestionsHidden && (suggestions.size > 0 || menu)) {
            e.preventDefault();
            this.setState({
              selectedSuggestion: Math.min(selectedSuggestion + 1, lastIndex)
            });
          }
          break;
        case 'ArrowUp':
          if (!suggestionsHidden && (suggestions.size > 0 || menu)) {
            e.preventDefault();
            this.setState({
              selectedSuggestion: Math.max(selectedSuggestion - 1, firstIndex)
            });
          }
          break;
        case 'Enter':
        case 'Tab':
          // Select suggestion
          if (!suggestionsHidden && selectedSuggestion > -1 && (suggestions.size > 0 || menu)) {
            e.preventDefault();
            e.stopPropagation();
            this.setState({
              selectedSuggestion: firstIndex
            });
            if (selectedSuggestion < suggestions.size) {
              this.props.onSuggestionSelected(this.state.tokenStart, this.state.lastToken, suggestions.get(selectedSuggestion));
            } else if (menu) {
              const item = menu[selectedSuggestion - suggestions.size];
              this.handleMenuItemAction(item, e);
            }
          }
          break;
      }
      if (e.defaultPrevented || !this.props.onKeyDown) {
        return;
      }
      if (this.props.onKeyDown) {
        this.props.onKeyDown(e);
      }
    };
    this.onBlur = () => {
      this.setState({
        suggestionsHidden: true,
        focused: false
      });
    };
    this.onFocus = () => {
      this.setState({
        focused: true
      });
    };
    this.onSuggestionClick = e => {
      const index = Number(e.currentTarget?.getAttribute('data-index'));
      const suggestion = this.props.suggestions.get(index);
      this.props.onSuggestionSelected(this.state.tokenStart, this.state.lastToken, suggestion);
      this.input?.focus();
      e.preventDefault();
    };
    this.setInput = c => {
      this.input = c;
    };
    this.renderSuggestion = (suggestion, i) => {
      const {
        selectedSuggestion
      } = this.state;
      let inner, key;
      if (typeof suggestion === 'object') {
        inner = <AutosuggestEmoji emoji={suggestion} />;
        key = suggestion.id;
      } else if (suggestion[0] === '#') {
        inner = suggestion;
        key = suggestion;
      } else {
        inner = <AutosuggestAccount id={suggestion} />;
        key = suggestion;
      }
      return <div role='button' tabIndex={0} key={key} data-index={i} className={classNames({
        'px-4 py-2.5 text-sm text-gray-700 dark:text-gray-400 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 group': true,
        'bg-gray-100 dark:bg-slate-700 hover:bg-gray-100 dark:hover:bg-gray-700': i === selectedSuggestion
      })} onMouseDown={this.onSuggestionClick} onTouchEnd={this.onSuggestionClick}>
        {inner}
      </div>;
    };
    this.handleMenuItemAction = (item, e) => {
      this.onBlur();
      if (item?.action) {
        item.action(e);
      }
    };
    this.handleMenuItemClick = item => {
      return e => {
        e.preventDefault();
        this.handleMenuItemAction(item, e);
      };
    };
    this.renderMenu = () => {
      const {
        menu,
        suggestions
      } = this.props;
      const {
        selectedSuggestion
      } = this.state;
      if (!menu) {
        return null;
      }
      return menu.map((item, i) => <a className={classNames('flex items-center space-x-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-400 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700', {
        selected: suggestions.size - selectedSuggestion === i
      })} href='#' role='button' tabIndex={0} onMouseDown={this.handleMenuItemClick(item)} key={i}>
        {item?.icon && <Icon src={item.icon} />}

        <span>{item?.text}</span>
      </a>);
    };
  }
  componentDidUpdate(prevProps, prevState) {
    const {
      suggestions
    } = this.props;
    if (suggestions !== prevProps.suggestions && suggestions.size > 0 && prevState.suggestionsHidden && prevState.focused) {
      this.setState({
        suggestionsHidden: false
      });
    }
  }
  setPortalPosition() {
    if (!this.input) {
      return {};
    }
    const {
      top,
      height,
      left,
      width
    } = this.input.getBoundingClientRect();
    if (this.props.resultsPosition === 'below') {
      return {
        left,
        width,
        top: top + height
      };
    }
    return {
      left,
      width,
      top,
      transform: 'translate(0, -100%)'
    };
  }
  render() {
    const {
      value,
      suggestions,
      disabled,
      placeholder,
      onKeyUp,
      autoFocus,
      className,
      id,
      maxLength,
      menu
    } = this.props;
    const {
      suggestionsHidden
    } = this.state;
    const style = {
      direction: 'ltr'
    };
    const visible = !suggestionsHidden && (!suggestions.isEmpty() || menu && value);
    if (isRtl(value)) {
      style.direction = 'rtl';
    }
    return [<div key='input' className='relative w-full'>
        <label className='sr-only'>{placeholder}</label>

        <input type='text' className={classNames({
        'block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-slate-800 dark:text-white dark:placeholder:text-gray-500 focus:ring-primary-500 focus:border-primary-500': true
      }, className)} ref={this.setInput} disabled={disabled} placeholder={placeholder} autoFocus={autoFocus} value={value} onChange={this.onChange} onKeyDown={this.onKeyDown} onKeyUp={onKeyUp} onFocus={this.onFocus} onBlur={this.onBlur} style={style} aria-autocomplete='list' id={id} maxLength={maxLength} data-testid='autosuggest-input' />
      </div>, <Portal key='portal'>
        <div style={this.setPortalPosition()} className={classNames({
        'fixed w-full z-[1001] shadow bg-white dark:bg-slate-800 rounded-lg py-1': true,
        hidden: !visible,
        block: visible
      })}>
          <div className='space-y-0.5'>
            {suggestions.map(this.renderSuggestion)}
          </div>

          {this.renderMenu()}
        </div>
      </Portal>];
  }
}
AutosuggestInput.defaultProps = {
  autoFocus: false,
  autoSelect: true,
  searchTokens: ImmutableList(['@', ':', '#']),
  resultsPosition: 'below'
};