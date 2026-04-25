import Picker, { type PickerPlacement } from "@skax/picker";

class WcPicker extends HTMLElement {
  private _picker: Picker | null = null;
  private _syncingOpenAttr = false;

  static get observedAttributes() {
    return ["content", "trigger", "placement", "open", "disabled", "mobile"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.render();
  }

  connectedCallback() {
    this._initPicker();
    this._syncDisabled();
    this._syncOpen();
  }

  disconnectedCallback() {
    this._destroyPicker();
  }

  attributeChangedCallback(name: string, _oldValue: string | null, newValue: string | null) {
    if (!this.isConnected) {
      return;
    }

    if (name === "content" && this._picker) {
      this._picker.innerHTML(newValue ?? "");
      return;
    }

    if (name === "disabled") {
      this._syncDisabled();
      return;
    }

    if (name === "open") {
      this._syncOpen();
      return;
    }

    this._recreatePicker();
  }

  private render() {
    if (!this.shadowRoot) {
      return;
    }

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          cursor: pointer;
          display: inline-flex;
        }

        :host([disabled]) {
          cursor: not-allowed;
        }
      </style>
      <slot></slot>
    `;
  }

  private _initPicker() {
    if (this._picker) {
      return;
    }

    this._picker = new Picker(this, {
      content: this.getAttribute("content") ?? "",
      isMobile: this.hasAttribute("mobile"),
      onOpenChange: (open) => {
        this._syncingOpenAttr = true;
        if (open) {
          this.setAttribute("open", "true");
        } else {
          this.removeAttribute("open");
        }
        this._syncingOpenAttr = false;
      },
      placement: this._getPlacement(),
      trigger: this._getTrigger(),
    });
  }

  private _destroyPicker() {
    this._picker?.destroy();
    this._picker = null;
  }

  private _recreatePicker() {
    const isOpen = this.hasAttribute("open");
    this._destroyPicker();
    this._initPicker();
    if (isOpen) {
      this._syncOpen();
    }
  }

  private _syncDisabled() {
    if (this._picker) {
      this._picker.disabled = this.hasAttribute("disabled");
    }
  }

  private _syncOpen() {
    if (this._syncingOpenAttr || !this._picker) {
      return;
    }

    this._picker.open = this.hasAttribute("open") && this.getAttribute("open") !== "false";
  }

  private _getPlacement(): PickerPlacement {
    const placement = this.getAttribute("placement");

    switch (placement) {
      case "top":
      case "tl":
      case "tr":
      case "bottom":
      case "bl":
      case "br":
        return placement;
      default:
        return "bottom";
    }
  }

  private _getTrigger(): "click" | "hover" {
    return this.getAttribute("trigger") === "hover" ? "hover" : "click";
  }
}

customElements.define("wc-picker", WcPicker);

export interface HTMLElementTagNameMap {
  "wc-picker": WcPicker;
}
