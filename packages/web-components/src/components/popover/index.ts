import './index.scss';

class Popover extends HTMLElement {
  private _$popover: HTMLDivElement | undefined;
  _list: Array<{ label: string; value: string }> = [];

  static get observedAttributes() {
    return ['list', 'open'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' }); // 使用 Shadow DOM
    this.render();
    this._list = [];
  }

  render() {
    // 创建 Popover 内容
    if (this.shadowRoot) {
      this.shadowRoot.innerHTML = `
        <style>
         :host{
            position: relative;
            inline-flex
        }

        .wc-popover {
            position: absolute;
            background: white;
            border-radius: 4px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
            display: none; /* Initially hidden */
            z-index: 1000;
            left: 0;
        }

        .wc-popover > ul {
            list-style: none;
            padding: 5px 0;
            margin: 0;
        }
        .wc-popover > ul li {
            list-style: none;
            padding: 4px 10px;
            user-select: none;
            cursor: pointer;
            height: 21px;
            line-height: 21px;
        }
        .wc-popover > ul li:hover {
            background-color: #eee;
        }
        .wc-popover.wc-show {
            display: block;
        }
        </style>
        <slot></slot>
        <div class="wc-popover"></div>
      `;
    }

    // ${this.getAttribute("content")}
    // prettier-ignore
    this._$popover = this.shadowRoot?.querySelector(".wc-popover") as HTMLDivElement;
    window.addEventListener('blur', this._hide.bind(this));
  }

  connectedCallback() {
    // 监听点击事件以显示 Popover
    // prettier-ignore
    this.shadowRoot?.querySelector("slot")?.addEventListener("click", this._toggleShow.bind(this));
  }

  private _toggleShow() {
    this._$popover?.classList.toggle('wc-show');
  }

  private _hide() {
    this._$popover?.classList.remove('wc-show');
  }

  private _show() {
    this._$popover?.classList.add('wc-show');
  }

  disconnectedCallback() {
    // prettier-ignore
    this.shadowRoot?.querySelector("slot")?.removeEventListener("click", this._toggleShow.bind(this));
    window.removeEventListener('blur', this._hide.bind(this));
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    console.log(`属性 ${name} 已变更。`);
    if (name === 'list') {
      try {
        this._list = JSON.parse(newValue) as unknown as any[];
        if (this.shadowRoot?.querySelector('.wc-popover')) {
          const listNode = `<ul>
                ${this._list
                  .map(item => {
                    return `<li>${item.label}</li>`;
                  })
                  .join('')}
            </ul>`;
          if (this.shadowRoot?.querySelector('.wc-popover')) {
            (this.shadowRoot.querySelector('.wc-popover') as HTMLElement).innerHTML = listNode;
          }
        }
      } catch (_error) {
        //
      }
    } else if (name === 'open') {
      if (!!newValue as unknown as string) this._show();
    }
  }
}

/** 添加标签 */
export interface HTMLElementTagNameMap {
  'wc-popover': Popover;
}

// 注册自定义元素
customElements.define('wc-popover', Popover);
