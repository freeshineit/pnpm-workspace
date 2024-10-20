import "./index.scss";

class Popover extends HTMLElement {
  private _$popover: HTMLDivElement | undefined;

  constructor() {
    super();
    this.attachShadow({ mode: "open" }); // 使用 Shadow DOM
    this.render();
  }

  render() {
    // 创建 Popover 内容
    if (this.shadowRoot) {
      this.shadowRoot.innerHTML = `
        <style>
        .popover {
            position: absolute;
            background: white;
            border: 1px solid #ccc;
            border-radius: 4px;
            padding: 10px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
            display: none; /* Initially hidden */
            z-index: 1000;
        }

        .popover.show {
            display: block; /* Show when active */
        }
        </style>
        <slot></slot>
        <div class="popover">${this.getAttribute("content")}</div>
      `;
    }
    // prettier-ignore
    this._$popover = this.shadowRoot?.querySelector(".popover") as HTMLDivElement;
  }

  connectedCallback() {
    // 监听点击事件以显示 Popover
    this.shadowRoot?.querySelector("slot")?.addEventListener("click", () => {
      this._$popover?.classList.toggle("show");
    });
  }

  clickPopover() {
    this._$popover?.classList.toggle("show");
  }

  disconnectedCallback() {
    // this.removeEventListener("click", this.clickPopover.bind(this));
  }
}

/** 添加标签 */
export interface HTMLElementTagNameMap {
  "wc-button": Popover;
}

// 注册自定义元素
customElements.define("my-popover", Popover);
