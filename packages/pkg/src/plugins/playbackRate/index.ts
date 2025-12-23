import "./index.scss";
import { type IPluginParameters } from "../interface";

export interface IVolumeOptions extends IPluginParameters {
  rate?: number[];
}

const prefixCls = "vv-playbackrate";

/**
 * @description 播放倍速
 */
class PlaybackRate {
  name = "playbackrate";

  // ------------- private ------------------
  private readonly _options: IVolumeOptions;
  private _$container: Element | undefined;
  private readonly _$parentContainer: Element;

  constructor(options: IVolumeOptions) {
    this._options = options;
    if (typeof this._options.getContainer === "function") {
      this._$parentContainer = this._options.getContainer(this._options);
    } else {
      this._$parentContainer = this._options.getContainer;
    }
    this._render();
  }

  _render() {
    this._$container = document.createElement("div");
    this._$container.classList.add(`${prefixCls}-holder`);
    this._$container.setAttribute("tabindex", "0");
    this._$container.innerHTML = `
        <div class="${prefixCls}">
          <div class="${prefixCls}-bar">
            <span class="${prefixCls}-dot"></span>
          </div>
        </div>
        <div>+</div>
    `;
    this._$parentContainer?.appendChild(this._$container);
    return this._$container;
  }
}

export default PlaybackRate;
