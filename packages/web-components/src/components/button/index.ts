class WcButton extends HTMLElement {
  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: 'open' });

    const style = document.createElement('style');
    style.textContent = `
      :host {
        display: inline-block;
      }
      .vv-button {
        height: 32px;
        background-color: #0099e5;
        outline: none;
        border: 1px solid #0099e5;
        cursor: pointer;
        padding: 4px 5px;
        color: #fff;
      }
      .vv-button:disabled {
        cursor: not-allowed;
        opacity: 0.65;
      }
    `;

    const btnElem = document.createElement('button');
    btnElem.classList.add('vv-button');

    const slot = document.createElement('slot');
    btnElem.appendChild(slot);

    shadowRoot.appendChild(style);
    shadowRoot.appendChild(btnElem);
  }
}

customElements.define('wc-button', WcButton);

/** 添加标签 */
export interface HTMLElementTagNameMap {
  'wc-button': WcButton;
}

// export default WcButton;
