import cls from "classnames";
import "./index.scss";

interface PopoverItem {
  label: string | (() => string);
  value: any;
}

// https://ant.design/components/tooltip-cn
export interface PopoverOptions {
  trigger?: "hover" | "click";
  placement?:
    | "top"
    | "left"
    | "right"
    | "bottom"
    | "topLeft"
    | "topRight"
    | "bottomLeft"
    | "bottomRight"
    | "leftTop"
    | "leftBottom"
    | "rightTop"
    | "rightBottom";
  open?: boolean;
  zIndex?: number;
  onOpenChange?: (open: boolean) => void;
  /** 气泡被遮挡时自动调整位置 */
  autoAdjustOverflow?: boolean;
  color?: string;
  getPopupContainer: HTMLElement | (() => HTMLElement);
  overlayClassName?: string;
  overlayStyle?: string;
  // 卡片内容区域的样式对象
  overlayInnerStyle?: string;
  list: PopoverItem[];
  title?: string;
  itemHeight: number;
  /**  */
  renderContent?: string | (() => string);
}

const prefixCls = "vv-popover";

const PLACEMENT = [
  "top",
  "left",
  "right",
  "bottom",
  "topLeft",
  "topRight",
  "bottomLeft",
  "bottomRight",
  "leftTop",
  "leftBottom",
  "rightTop",
  "rightBottom",
];

const DEFAULT_OPTIONS: PopoverOptions = {
  itemHeight: 20,
  list: [],
  trigger: "hover",
  open: false,
  zIndex: 100,
  autoAdjustOverflow: true,
  placement: "top",
  getPopupContainer: document.body,
};

class Popover {
  container: HTMLElement | undefined;
  private readonly _options: PopoverOptions;
  private readonly _$container = document.body;
  private _$popover: HTMLDivElement | undefined;

  constructor(options: PopoverOptions) {
    this._options = { ...DEFAULT_OPTIONS, ...options };
    // prettier-ignore
    this._$container = typeof this._options.getPopupContainer === "function" ? this._options.getPopupContainer() : this._options.getPopupContainer;

    this._render();
  }

  _render() {
    if (this._$popover) {
      return;
    }
    this._$popover = document.createElement("div");
    // prettier-ignore
    const placementCls = cls({
      [`${prefixCls}-${this._options.placement}`]: PLACEMENT.includes(this._options.placement || ''),
    })

    this._$popover.classList.add(prefixCls, placementCls);
    if (this._options?.overlayClassName)
      this._$popover.classList.add(this._options?.overlayClassName);

    this._$popover.innerHTML = `
            <div class="${prefixCls}-container">
                ${this._options.title ? `<div class="${prefixCls}-title">${this._options.title}</div>` : ""}
                <div class="${prefixCls}-content">
                 ${this._options.list
                   .map((item, index) => {
                     return `<div class="${prefixCls}-item" data-index="${index}" data-value=${item.value}>
                        ${
                          typeof item.label === "function"
                            ? item.label()
                            : item.label
                        }
                     </div>`;
                   })
                   .join("")}
                </div>
            </div>
    `;
    this._$container.appendChild(this._$popover);
    return this._$container;
  }
}

export default Popover;
