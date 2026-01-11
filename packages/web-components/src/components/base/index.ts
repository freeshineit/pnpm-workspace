import '@webcomponents/webcomponentsjs';

class BaseComponent extends HTMLElement {
  constructor() {
    super();
  }

  render() {
    throw new Error('BaseComponent Error!');
  }
}

export default BaseComponent;
