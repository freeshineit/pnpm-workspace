import { type IPluginParameters, type IPlugin } from "../interface";
import "./index.scss";

export interface IProgressOptions extends IPluginParameters {
  /** 进度条总长度 */
  duration: number;
  /** 当前时间节点 */
  current: number;
  disabled: boolean;
  /** 已缓存的时长 */
  buffered: number;
  onChange?: (current: number) => void;
}

const prefixCls = "vv-progress";

class Progress implements IPlugin {
  private readonly _options: IProgressOptions;
  readonly name: string = "Progress";
  private _current = 0;
  private _disabled = false;
  private _percentage = 0;
  private _$container: Element | undefined;
  private readonly _$parentContainer: Element;
  private _hover = false;

  constructor(options: IProgressOptions) {
    this._options = options;

    if (this._options.duration === undefined || this._options.duration <= 0) {
      throw new Error("duration 不能为空切不能小于等于0");
    }

    if (typeof this._options.getContainer === "function") {
      this._$parentContainer = this._options.getContainer(this._options);
    } else {
      this._$parentContainer = this._options.getContainer;
    }
    this._render();
    this._eventListener();

    this.current = this._options.current || 0;
    this.disabled = this._options.disabled || false;
    this._setPercentage(this._current);
  }

  _setPercentage(current: number) {
    this._percentage = +(current / this._options.duration).toFixed(6);

    if (this._percentage > 100) {
      this._percentage = 100;
    }
    if (this._percentage <= 0) {
      this._percentage = 0;
    }

    // prettier-ignore
    const $current = this._$container?.querySelector(`.${prefixCls}-current`) as HTMLDivElement
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
      this._$container?.classList.add(`${prefixCls}-disabled`);
    } else {
      this._$container?.classList.remove(`${prefixCls}-disabled`);
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
    if (this._current !== current) {
      this._options.onChange?.(this._current);
    }

    if (current < 0 || current > this._options.duration) {
      // 超出上下限
      this._current = 0;
    } else {
      this._current = current;
    }

    this._setPercentage(this._current);
  }

  private _render() {
    this._$container = document.createElement("div");
    this._$container.classList.add(`${prefixCls}-holder`);
    this._$container.setAttribute("tabindex", "0");
    this._$container.innerHTML = `<div class="${prefixCls}">
    <div class="${prefixCls}-current-buffered"></div>
    <div class="${prefixCls}-current"><span class="${prefixCls}-dot"></span></div></div>
    `;
    this._$parentContainer?.appendChild(this._$container);
    return this._$container;
  }

  private _eventListener() {
    if (this._$container) {
      this._clickEvent = this._clickEvent.bind(this);
      this._mouseEnterEvent = this._mouseEnterEvent.bind(this);
      this._mouseLeaveEvent = this._mouseLeaveEvent.bind(this);
      this._mouseMoveEvent = this._mouseMoveEvent.bind(this);
      this._mouseOutEvent = this._mouseOutEvent.bind(this);
      this._mouseOverEvent = this._mouseOverEvent.bind(this);
      this._mouseUpEvent = this._mouseUpEvent.bind(this);

      this._$container.addEventListener("click", this._clickEvent);
      this._$container.addEventListener("blur", this._blurEvent);
      this._$container.addEventListener("mouseenter", this._mouseEnterEvent);
      this._$container.addEventListener("mouseleave", this._mouseLeaveEvent);
      this._$container.addEventListener("mousemove", this._mouseMoveEvent);
      this._$container.addEventListener("mouseout", this._mouseOutEvent);
      this._$container.addEventListener("mouseover", this._mouseOverEvent);
      this._$container.addEventListener("mouseup", this._mouseUpEvent);

      this._keyDownEvent = this._keyDownEvent.bind(this);
      this._$container.addEventListener("keydown", this._keyDownEvent);

      // dot
      // prettier-ignore
      const $dot = this._$container.querySelector(`.${prefixCls}-dot`) as HTMLSpanElement
      if ($dot) {
        //
      }
    }
  }

  private _clickEvent(e) {
    console.log("click", e);
  }

  private _blurEvent(e) {
    console.warn("blur", e);
    e.preventDefault();
  }

  private _mouseEnterEvent(e) {
    this._hover = true;
    this._setHover();
    console.log("mouseenter", e);
  }

  private _mouseLeaveEvent(e) {
    this._hover = false;
    this._setHover();
    console.log("mouseleave", e);
  }

  private _mouseMoveEvent(e) {
    this._hover = true;
    this._setHover();
    console.log("mousemove", e);
  }

  private _mouseOutEvent(e) {
    this._hover = false;
    this._setHover();
    console.log("mouseout", e);
  }

  private _mouseOverEvent(e) {
    this._hover = true;
    this._setHover();
    console.log("mouseover", e);
  }

  private _mouseUpEvent(e) {
    console.log("mouseover", e);
  }

  private _keyDownEvent(e: KeyboardEvent) {
    console.log("------", e.keyCode, e.key, this._hover);
    // prettier-ignore
    if ((e.keyCode === 27 || e.key === "Escape" || e.key === "Esc") && this._hover) {
      console.log("------", e.keyCode, e.key, this._hover);
      (this._$container as HTMLDivElement).focus?.()
      e.preventDefault();
    }
  }

  private _setHover() {
    // 防止移动过快 导致 hover 闪动
    setTimeout(() => {
      if (this._hover) {
        this._$container.classList.add(`${prefixCls}-hover`);
      } else {
        this._$container.classList.remove(`${prefixCls}-hover`);
      }
    }, 10);
  }

  private _destroy() {
    if (this._$container) {
      this._clickEvent = this._clickEvent.bind(this);
      this._$container.removeEventListener("click", this._clickEvent);
      this._$container.removeEventListener("blur", this._blurEvent);
      this._$container.removeEventListener("mouseenter", this._mouseEnterEvent);
      this._$container.removeEventListener("mouseleave", this._mouseLeaveEvent);
      this._$container.removeEventListener("mousemove", this._mouseMoveEvent);
      this._$container.removeEventListener("mouseout", this._mouseOutEvent);
      this._$container.removeEventListener("mouseover", this._mouseOverEvent);
      this._$container.removeEventListener("mouseup", this._mouseUpEvent);
      this._$container.removeEventListener("keydown", this._keyDownEvent);

      // dot
      // prettier-ignore
      const $dot = this._$container.querySelector(`.${prefixCls}-dot`) as HTMLSpanElement
      if ($dot) {
        //
      }
    }
  }
}

export default Progress;
