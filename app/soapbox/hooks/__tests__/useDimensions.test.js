import { renderHook, act } from '@testing-library/react-hooks';
import { useDimensions } from '../useDimensions';
let listener = undefined;
window.ResizeObserver = class ResizeObserver {
  constructor(ls) {
    listener = ls;
  }
  observe() {}
  disconnect() {}
};
describe('useDimensions()', () => {
  it('defaults to 0', () => {
    const {
      result
    } = renderHook(() => useDimensions());
    act(() => {
      const div = document.createElement('div');
      result.current[1](div);
    });
    expect(result.current[2]).toMatchObject({
      width: 0,
      height: 0
    });
  });
  it('measures the dimensions of a DOM element', () => {
    const {
      result
    } = renderHook(() => useDimensions());
    act(() => {
      const div = document.createElement('div');
      result.current[1](div);
    });
    act(() => {
      listener([{
        contentRect: {
          width: 200,
          height: 200
        }
      }]);
    });
    expect(result.current[2]).toMatchObject({
      width: 200,
      height: 200
    });
  });
  it('disconnects on unmount', () => {
    const disconnect = jest.fn();
    window.ResizeObserver = class ResizeObserver {
      observe() {}
      disconnect() {
        disconnect();
      }
    };
    const {
      result,
      unmount
    } = renderHook(() => useDimensions());
    act(() => {
      const div = document.createElement('div');
      result.current[1](div);
    });
    expect(disconnect).toHaveBeenCalledTimes(0);
    unmount();
    expect(disconnect).toHaveBeenCalledTimes(1);
  });
});