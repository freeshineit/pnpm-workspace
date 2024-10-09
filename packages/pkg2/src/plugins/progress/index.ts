import { type IPluginParameters, type IPlugin } from "../interface";
import "./index.scss";

export interface IProgressOptions extends IPluginParameters {
  /** 进度条总长度 */
  total: number;
  current: number;
  disabled: boolean;
}

class Progress implements IPlugin {
  private readonly _options: IProgressOptions;
  readonly name: string = "Progress";
  private _current = 0;
  private _disabled = false;
  private _percentage = 0;
  private _$container: Element | undefined;
  private readonly _$parentContainer: Element;

  constructor(options: IProgressOptions) {
    this._options = options;

    if (this._options.total === undefined || this._options.total <= 0) {
      throw new Error("total 不能为空切不能小于等于0");
    }

    if (typeof this._options.getContainer === "function") {
      this._$parentContainer = this._options.getContainer(this._options);
    } else {
      this._$parentContainer = this._options.getContainer;
    }
    this._render();

    this.current = this._options.current || 0;
    this.disabled = this._options.disabled || false;
    this._setPercentage(this._current);
  }

  _setPercentage(current: number) {
    this._percentage = +(current / this._options.total).toFixed(6);
    // prettier-ignore
    const $current = this._$container?.querySelector(".vv-progress-current") as HTMLDivElement
    if ($current) {
      $current.setAttribute("data-percentage", this._percentage + "");
      $current.style.cssText += `;width: ${this._percentage * 100}%;`;
    }
  }

  /**
   * @description 设置进度条禁用
   * @memberof Progress
   */
  set disabled(disabled: boolean) {
    this._disabled = !!disabled;

    if (this._disabled) {
      this._$container?.classList.add("vv-progress-disabled");
    } else {
      this._$container?.classList.remove("vv-progress-disabled");
    }
  }

  /**
   * @description 设置当前进度条禁用状态
   * @memberof Progress
   */
  get disabled() {
    return this._disabled;
  }

  /**
   * @description 获取当前进度
   * @memberof Progress
   */
  get current() {
    return this._current;
  }

  /**
   * @description 设置当前进度
   * @memberof Progress
   */
  set current(current: number) {
    if (current < 0 || current > this._options.total) {
      // 超出上下限
      this._current = 0;
    } else {
      this._current = current;
    }
    this._setPercentage(this._current);
  }

  private _render() {
    this._$container = document.createElement("div");
    this._$container.classList.add("vv-progress");
    this._$container.innerHTML = `<div class="vv-progress-current"><span class="vv-progress-dot"/></div>`;
    this._$parentContainer?.appendChild(this._$container);
    return this._$container;
  }
}

export default Progress;
