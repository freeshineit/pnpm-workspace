import Store from '../src/index';
import '../src/style';

describe('Store', () => {
  test('constructs with default options', () => {
    const store = new Store();
    expect(store.options).toEqual({});
  });

  test('constructs with provided options', () => {
    const store = new Store({ id: 'abc' });
    expect(store.options).toEqual({ id: 'abc' });
  });

  test('on logs type, handler, and options', () => {
    const store = new Store({ id: 'x' });
    const handler = jest.fn();
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    store.on('event', handler);

    expect(logSpy).toHaveBeenCalledWith('event', handler, { id: 'x' });
    logSpy.mockRestore();
  });
});
