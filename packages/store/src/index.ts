export interface StoreOptions {
  id?: string;
}

class Store {
  options: StoreOptions;
  constructor(options: Partial<StoreOptions> = {}) {
    this.options = options;
  }

  on(type: string, fn: any) {
    console.log(type, fn, this.options);
  }
}

export default Store;
