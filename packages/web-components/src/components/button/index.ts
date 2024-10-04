// import BaseComponent from "../base";

// interface IButtonProps {
//   type: "primary";
// }

// class WcButton extends HTMLElement {
//   // Specify observed attributes so that
//   // attributeChangedCallback will work
//   // static get observedAttributes() {
//   //   return ["color", "size"];
//   // }

//   constructor() {
//     super();

//     const divElem = document.createElement("div");
//     divElem.textContent = this.getAttribute("text");

//     const shadowRoot = this.attachShadow({ mode: "open" });
//     shadowRoot.appendChild(divElem);
//   }

//   // connectedCallback() {
//   //   console.log("Custom square element added to page.");
//   //   // updateStyle(this);
//   // }

//   // disconnectedCallback() {
//   //   console.log("Custom square element removed from page.");
//   // }

//   // adoptedCallback() {
//   //   console.log("Custom square element moved to new page.");
//   // }

//   // attributeChangedCallback(name: string, oldValue: any, newValue: any) {
//   //   console.log("Custom square element attributes changed.");
//   //   // updateStyle(this);
//   // }

//   // render() {
//   //   return `
//   //     <button class="wc-button">button</button>
//   //   `;
//   // }
// }

class WcButton extends HTMLElement {
  constructor() {
    super();

    const divElem = document.createElement("div");
    divElem.textContent = this.getAttribute("text");

    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.appendChild(divElem);
  }
}

customElements.define("wc-button", WcButton);

/** 添加标签 */
export interface HTMLElementTagNameMap {
  "wc-button": WcButton;
}

// export default WcButton;
