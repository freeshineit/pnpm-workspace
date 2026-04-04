import Store from '../src/index';
import StoreFromMain from '../src/main';
import '../src/style';

describe('Store', () => {
  test('exports Store from main', () => {
    expect(StoreFromMain).toBe(Store);
  });

  test('constructs with default options', () => {
    const store = new Store();
    expect(store.options).toEqual({});
  });

  test('constructs with provided options', () => {
    const store = new Store({ id: 'abc' });
    expect(store.options).toEqual({ id: 'abc' });
  });

  // --- on / emit ---
  test('on registers a listener and emit calls it', () => {
    const store = new Store();
    const fn = jest.fn();
    store.on('change', fn);
    store.emit('change', 42);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith(42);
  });

  test('emit passes undefined when no data provided', () => {
    const store = new Store();
    const fn = jest.fn();
    store.on('ping', fn);
    store.emit('ping');
    expect(fn).toHaveBeenCalledWith(undefined);
  });

  test('on returns the store instance (chainable)', () => {
    const store = new Store();
    const fn = jest.fn();
    expect(store.on('x', fn)).toBe(store);
  });

  test('emit returns the store instance (chainable)', () => {
    const store = new Store();
    expect(store.emit('x')).toBe(store);
  });

  test('multiple listeners on the same event all receive the emit', () => {
    const store = new Store();
    const fn1 = jest.fn();
    const fn2 = jest.fn();
    store.on('update', fn1).on('update', fn2);
    store.emit('update', 'hello');
    expect(fn1).toHaveBeenCalledWith('hello');
    expect(fn2).toHaveBeenCalledWith('hello');
  });

  // --- off ---
  test('off removes a specific listener', () => {
    const store = new Store();
    const fn = jest.fn();
    store.on('data', fn);
    store.off('data', fn);
    store.emit('data', 1);
    expect(fn).not.toHaveBeenCalled();
  });

  test('off with no fn removes all listeners for the event', () => {
    const store = new Store();
    const fn1 = jest.fn();
    const fn2 = jest.fn();
    store.on('data', fn1).on('data', fn2);
    store.off('data');
    store.emit('data', 1);
    expect(fn1).not.toHaveBeenCalled();
    expect(fn2).not.toHaveBeenCalled();
  });

  test('off returns the store instance (chainable)', () => {
    const store = new Store();
    const fn = jest.fn();
    store.on('e', fn);
    expect(store.off('e', fn)).toBe(store);
  });

  // --- once ---
  test('once fires the listener exactly once', () => {
    const store = new Store();
    const fn = jest.fn();
    store.once('tick', fn);
    store.emit('tick', 1);
    store.emit('tick', 2);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith(1);
  });

  test('once returns the store instance (chainable)', () => {
    const store = new Store();
    const fn = jest.fn();
    expect(store.once('e', fn)).toBe(store);
  });

  // --- isolation ---
  test('two stores do not share events', () => {
    const s1 = new Store();
    const s2 = new Store();
    const fn = jest.fn();
    s1.on('event', fn);
    s2.emit('event', 'ignored');
    expect(fn).not.toHaveBeenCalled();
  });
});
