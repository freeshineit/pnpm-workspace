import "@webcomponents/webcomponentsjs";

class TemplateComponent extends HTMLElement {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor() {
    super();
  }

  render() {
    throw new Error("TemplateComponent Error!");
  }
}

export default TemplateComponent;
