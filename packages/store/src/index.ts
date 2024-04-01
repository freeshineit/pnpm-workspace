class Store {
  options: any;
  constructor(options: any) {
    this.options = options;
  }

  on(type: string, fn: any) {
    console.log(type, fn, this.options);
  }
}

export default Store;
