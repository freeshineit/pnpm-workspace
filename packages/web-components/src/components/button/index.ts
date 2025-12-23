class WcButton extends HTMLElement {
  constructor() {
    super();

    const btnElem = document.createElement('button');

    btnElem.classList.add('vv-button');
    btnElem.innerHTML = `
     <style>
        .vv-button {
          height: 32px;
          background-color: #0099e5;
          outline: none;
          border: 1px solid #0099e5;
          cursor: pointer;
          padding: 4px 5px;
          color: #fff;
        }
     </style>
    
    <slot></slot>`;

    const shadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.appendChild(btnElem);
  }
}

customElements.define('wc-button', WcButton);

/** 添加标签 */
export interface HTMLElementTagNameMap {
  'wc-button': WcButton;
}

// export default WcButton;
