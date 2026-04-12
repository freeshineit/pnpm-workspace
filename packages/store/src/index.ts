import "@skax/picker/dist/style/index.js";
import "./style";

export interface StoreOptions {
  id?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type EventListener<T = any> = (data: T) => void;

class Store {
  options: StoreOptions;
  private _events: Map<string, Set<EventListener>>;

  constructor(options: Partial<StoreOptions> = {}) {
    this.options = options;
    this._events = new Map();
  }

  on<T = unknown>(type: string, fn: EventListener<T>): this {
    if (!this._events.has(type)) {
      this._events.set(type, new Set());
    }
    this._events.get(type)!.add(fn as EventListener);
    return this;
  }

  once<T = unknown>(type: string, fn: EventListener<T>): this {
    const wrapper: EventListener<T> = data => {
      fn(data);
      this.off(type, wrapper);
    };
    return this.on(type, wrapper);
  }

  off<T = unknown>(type: string, fn?: EventListener<T>): this {
    if (!fn) {
      this._events.delete(type);
    } else {
      this._events.get(type)?.delete(fn as EventListener);
    }
    return this;
  }

  emit<T = unknown>(type: string, data?: T): this {
    this._events.get(type)?.forEach(listener => listener(data));
    return this;
  }
}

export default Store;
