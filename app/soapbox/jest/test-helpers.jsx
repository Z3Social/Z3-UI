import { configureMockStore } from '@jedmao/redux-mock-store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { merge } from 'immutable';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import '@testing-library/jest-dom';
import NotificationsContainer from '../features/ui/containers/notifications_container';
import { default as rootReducer } from '../reducers';
// Mock Redux
// https://redux.js.org/recipes/writing-tests/
const rootState = rootReducer(undefined, {});
const mockStore = configureMockStore([thunk]);

/** Apply actions to the state, one at a time. */
const applyActions = (state, actions, reducer) => {
  return actions.reduce((state, action) => reducer(state, action), state);
};

/** React Query client for tests. */
const queryClient = new QueryClient({
  logger: {
    // eslint-disable-next-line no-console
    log: console.log,
    warn: console.warn,
    error: () => {}
  },
  defaultOptions: {
    queries: {
      staleTime: 0,
      cacheTime: Infinity,
      retry: false
    }
  }
});
const createTestStore = initialState => createStore(rootReducer, initialState, applyMiddleware(thunk));
const TestApp = ({
  children,
  storeProps,
  routerProps = {}
}) => {
  let store;
  let appState = rootState;
  if (storeProps) {
    appState = merge(rootState, storeProps);
    store = createTestStore(appState);
  } else {
    store = createTestStore(appState);
  }
  const props = {
    locale: 'en',
    store
  };
  return <Provider store={props.store}>
      <QueryClientProvider client={queryClient}>
        <IntlProvider locale={props.locale}>
          <MemoryRouter {...routerProps}>
            {children}

            <NotificationsContainer />
          </MemoryRouter>
        </IntlProvider>
      </QueryClientProvider>
    </Provider>;
};
const customRender = (ui, options, store, routerProps) => render(ui, {
  wrapper: () => <TestApp children={ui} storeProps={store} routerProps={routerProps} />,
  ...options
});

/** Like renderHook, but with access to the Redux store. */
const customRenderHook = (callback, options, store) => {
  return renderHook(callback, {
    wrapper: ({
      children
    }) => <TestApp children={children} storeProps={store} />,
    ...options
  });
};
const mockWindowProperty = (property, value) => {
  const {
    [property]: originalProperty
  } = window;
  delete window[property];
  beforeAll(() => {
    Object.defineProperty(window, property, {
      configurable: true,
      writable: true,
      value
    });
  });
  afterAll(() => {
    window[property] = originalProperty;
  });
};
export * from '@testing-library/react';
export { customRender as render, customRenderHook as renderHook, mockStore, applyActions, rootState, rootReducer, mockWindowProperty, createTestStore, queryClient };