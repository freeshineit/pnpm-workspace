import '@webcomponents/webcomponentsjs';

class BaseComponent extends HTMLElement {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor() {
    super();
  }

  render() {
    throw new Error('BaseComponent Error!');
  }
}

export default BaseComponent;
