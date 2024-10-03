import TemplateComponent from "../common/template";

interface IButtonProps {
  type: "primary";
}

class WcButton extends TemplateComponent {
  // Specify observed attributes so that
  // attributeChangedCallback will work
  static get observedAttributes() {
    return ["color", "size"];
  }

  constructor(props: IButtonProps) {
    super();
    this.render();
  }

  connectedCallback() {
    console.log("Custom square element added to page.");
    // updateStyle(this);
  }

  disconnectedCallback() {
    console.log("Custom square element removed from page.");
  }

  adoptedCallback() {
    console.log("Custom square element moved to new page.");
  }

  attributeChangedCallback(name: string, oldValue: any, newValue: any) {
    console.log("Custom square element attributes changed.");
    // updateStyle(this);
  }

  render() {
    return `
      <button class="wc-button">button</button>
    `;
  }
}

customElements.define("wcc-button", WcButton);

/** 每个组件 */
export interface HTMLElementTagNameMap {
  "wc-button": WcButton;
}

export default WcButton;
