import {
  type PositionType,
  type PrismaZoomOptions,
  type CursorValue,
} from "./types";

const defaultPos: PositionType = [0, 0];
const defaultCursor = "auto";

export const DEFAULT_OPTIONS: Partial<PrismaZoomOptions> = {
  minZoom: 1,
  initialZoom: 1,
  maxZoom: 5,
  scrollVelocity: 0.2,
  animDuration: 0.25,
  doubleTouchMaxDelay: 300,
  decelerationDuration: 750,
  allowZoom: true,
  allowPan: true,
  allowTouchEvents: false,
  allowParentPanning: false,
  allowWheel: true,
  ignoredMouseButtons: [],
};

class PrismaZoom {
  container: HTMLElement;

  private readonly _options: Required<PrismaZoomOptions>;
  private _position: PositionType = [0, 0];
  private _zoom: number = 1;
  private _lastTouchTime: number | null;
  private _lastDoubleTapTime: number | null;
  private _lastRequestAnimationId: number | null;
  private _lastCursor: PositionType | null = [0, 0];
  private _lastShift: PositionType | null = null;
  private _lastTouch: PositionType | null = null;
  private _lastTouchDistance: number | null = null;
  private _cursor: CursorValue = defaultCursor;

  constructor(options: PrismaZoomOptions) {
    // prettier-ignore
    this._options = Object.assign({}, DEFAULT_OPTIONS, options) as Required<PrismaZoomOptions>;

    // Check container type and assign it
    if (this._options.container instanceof HTMLElement) {
      this.container = this._options.container;
    } else if (typeof this._options.container === "function") {
      this.container = this._options.container();
    } else {
      // prettier-ignore
      throw new Error("Container must be a HTMLElement or a function that returns a HTMLElement");
    }

    // init
    this._zoom = this._options.initialZoom || 1;
    this._lastTouchTime = null;
    this._lastDoubleTapTime = null;
    this._lastRequestAnimationId = null;

    this._init();
    this._events();
  }

  _init() {
    //
  }

  get zoom() {
    return this._zoom;
  }

  set zoom(zoom: number) {
    this._zoom = zoom;
    this._update();
    if (typeof this._options.onZoomChange === "function") {
      this._options.onZoomChange(zoom);
    }
  }

  get position() {
    return this._position;
  }

  set position(position: PositionType) {
    this._position = position;
    this._update();
    if (typeof this._options.onPanChange === "function") {
      this._options.onPanChange({ posX: position[0], posY: position[1] });
    }
  }

  _update() {
    if (!this.container) return;
    this.container.style.transition = `transform ease-out ${this._options.animDuration}s`;
    this.container.style.transform = `translate3d(${this._position[0]}px, ${this._position[1]}px, 0) scale(${this._zoom})`;
  }

  /**
   * @description Sets the zoom value
   * @param {Number} zoom  The new zoom value
   */
  setZoom(zoom: number) {
    this.zoom = zoom;
  }

  /**
   * @description Moves Element to the given position
   * @param {PositionType} pos  The new position
   */
  setPos(pos: PositionType) {
    this.position = pos;
  }

  _setTransitionDuration(duration: number) {
    this._options.animDuration = duration;
    this._update();
  }

  /**
   * Increments the zoom with the given value.
   * @param  {Number} value Zoom value
   */
  zoomIn(value: number) {
    let newPosX = this._position[0];
    let newPosY = this._position[1];

    const prevZoom = this._zoom;

    // prettier-ignore
    const newZoom = prevZoom + value < this._options.maxZoom ? prevZoom + value : this._options.maxZoom;

    if (newZoom !== prevZoom) {
      // prettier-ignore
      newPosX =(newPosX * (newZoom - 1)) / (prevZoom > 1 ? prevZoom - 1 : prevZoom);
      // prettier-ignore
      newPosY = (newPosY * (newZoom - 1)) / (prevZoom > 1 ? prevZoom - 1 : prevZoom);
    }

    this.setZoom(newZoom);
    this.setPos([newPosX, newPosY]);
    this._setTransitionDuration(this._options.animDuration);
  }

  /**
   * Decrements the zoom with the given value.
   * @param  {Number} value Zoom value
   */
  zoomOut(value: number) {
    let [newPosX, newPosY] = this._position;
    const prevZoom = this._zoom;
    // prettier-ignore
    const newZoom = prevZoom - value > this._options.minZoom ? prevZoom - value : this._options.minZoom

    if (newZoom !== prevZoom) {
      newPosX = (newPosX * (newZoom - 1)) / (prevZoom - 1);
      newPosY = (newPosY * (newZoom - 1)) / (prevZoom - 1);
    }

    this.setZoom(newZoom);
    this.setPos([newPosX, newPosY]);
    this._setTransitionDuration(this._options.animDuration);
  }

  /**
   * Zoom-in on the specified zone with the given relative coordinates and dimensions.
   * @param  {Number} relX      Relative X position of the zone left-top corner in pixels
   * @param  {Number} relY      Relative Y position of the zone left-top corner in pixels
   * @param  {Number} relWidth  Zone width in pixels
   * @param  {Number} relHeight Zone height in pixels
   */
  zoomToZone(relX: number, relY: number, relWidth: number, relHeight: number) {
    if (!this.container) return;
    let [newPosX, newPosY] = this._position;

    // prettier-ignore
    const parentRect = (this.container?.parentNode as HTMLElement).getBoundingClientRect();
    const prevZoom = this._zoom;

    // Calculate zoom factor to scale the zone
    const optimalZoomX = parentRect.width / relWidth;
    const optimalZoomY = parentRect.height / relHeight;
    const newZoom = Math.min(optimalZoomX, optimalZoomY, this._options.maxZoom);

    // Calculate new position to center the zone
    const rect = this.container.getBoundingClientRect();
    // prettier-ignore
    const [centerX, centerY] = [rect.width / prevZoom / 2, rect.height / prevZoom / 2];
    // prettier-ignore
    const [zoneCenterX, zoneCenterY] = [ relX + relWidth / 2, relY + relHeight / 2];
    newPosX = (centerX - zoneCenterX) * newZoom;
    newPosY = (centerY - zoneCenterY) * newZoom;

    this.setZoom(newZoom);
    this.setPos([newPosX, newPosY]);
    this._setTransitionDuration(this._options.animDuration);
  }

  /**
   * Calculates new translate positions for CSS transformations.
   * @param  {Number} x     Relative (rect-based) X position in pixels
   * @param  {Number} y     Relative (rect-based) Y position in pixels
   * @param  {Number} zoom  Scale value
   * @return {Array}        New X and Y positions
   */
  getNewPosition(x: number, y: number, newZoom: number): PositionType {
    //
    const [prevPosX, prevPosY] = this._position;
    const prevZoom = this._zoom;

    if (newZoom === 1 || !this.container) return [0, 0];

    if (newZoom > prevZoom) {
      // Get container coordinates
      const rect = this.container.getBoundingClientRect();

      // Retrieve rectangle dimensions and mouse position
      const [centerX, centerY] = [rect.width / 2, rect.height / 2];
      // prettier-ignore
      const [relativeX, relativeY] = [x - rect.left - window.pageXOffset, y - rect.top - window.pageYOffset];

      // If we are zooming down, we must try to center to mouse position
      // prettier-ignore
      const [absX, absY] = [(centerX - relativeX) / prevZoom, (centerY - relativeY) / prevZoom];
      const ratio = newZoom - prevZoom;
      return [prevPosX + absX * ratio, prevPosY + absY * ratio];
    } else {
      // If we are zooming down, we shall re-center the element
      // prettier-ignore
      return [(prevPosX * (newZoom - 1)) / (prevZoom - 1), (prevPosY * (newZoom - 1)) / (prevZoom - 1)];
    }
  }

  /**
   * Applies a full-zoom on the specified X and Y positions
   * @param  {Number} x Relative (rect-based) X position in pixels
   * @param  {Number} y Relative (rect-based) Y position in pixels
   */
  fullZoomInOnPosition(x: number, y: number) {
    const zoom = this._options.maxZoom;

    this.setPos(this.getNewPosition(x, y, zoom));
    this.setZoom(zoom);
    this._setTransitionDuration(this._options.animDuration);
  }

  /**
   * Calculates the narrowed shift for panning actions.
   * @param  {Number} shift      Initial shift in pixels
   * @param  {Number} minLimit   Minimum limit (left or top) in pixels
   * @param  {Number} maxLimit   Maximum limit (right or bottom) in pixels
   * @param  {Number} minElement Left or top element position in pixels
   * @param  {Number} maxElement Right or bottom element position in pixels
   * @return {Number}            Narrowed shift
   */
  // prettier-ignore
  getLimitedShift(shift: number, minLimit: number, maxLimit: number, minElement: number, maxElement: number) {
    if (shift > 0) {
      if (minElement > minLimit) {
        // Forbid move if we are moving to left or top while we are already out minimum boudaries
        return 0
      } else if (minElement + shift > minLimit) {
        // Lower the shift if we are going out boundaries
        return minLimit - minElement
      }
    } else if (shift < 0) {
      if (maxElement < maxLimit) {
        // Forbid move if we are moving to right or bottom while we are already out maximum boudaries
        return 0
      } else if (maxElement + shift < maxLimit) {
        // Lower the shift if we are going out boundaries
        return maxLimit - maxElement
      }
    }

    return shift
  }

  /**
   * @default get cursor based on canMoveOnX and canMoveOnY
   * @param canMoveOnX
   * @param canMoveOnY
   * @returns
   */
  getCursor(canMoveOnX: boolean, canMoveOnY: boolean) {
    if (canMoveOnX && canMoveOnY) {
      return "move";
    } else if (canMoveOnX) {
      return "ew-resize";
    } else if (canMoveOnY) {
      return "ns-resize";
    } else {
      return "auto";
    }
  }

  /**
   * Moves the element by incrementing its position with given X and Y values.
   * @param  {Number} shiftX             Position change to apply on X axis in pixels
   * @param  {Number} shiftY             Position change to apply on Y axis in pixels
   * @param  {Number} transitionDuration Transition duration (in seconds)
   */
  move(shiftX: number, shiftY: number, transitionDuration = 0) {
    if (!this.container) return;

    let [newPosX, newPosY] = this._position;

    // Get container and container's parent coordinates
    const rect = this.container.getBoundingClientRect();
    // prettier-ignore
    const parentRect = (this.container.parentNode as HTMLElement).getBoundingClientRect();

    const [isLarger, isOutLeftBoundary, isOutRightBoundary] = [
      // Check if the element is larger than its container
      rect.width > parentRect.right - parentRect.left,
      // Check if the element is out its container left boundary
      shiftX > 0 && rect.left - parentRect.left < 0,
      // Check if the element is out its container right boundary
      shiftX < 0 && rect.right - parentRect.right > 0,
    ];

    const canMoveOnX = isLarger || isOutLeftBoundary || isOutRightBoundary;
    if (canMoveOnX) {
      // prettier-ignore
      newPosX += this.getLimitedShift(shiftX, parentRect.left, parentRect.right, rect.left, rect.right);
    }

    const [isHigher, isOutTopBoundary, isOutBottomBoundary] = [
      // Check if the element is higher than its container
      rect.height > parentRect.bottom - parentRect.top,
      // Check if the element is out its container top boundary
      shiftY > 0 && rect.top - parentRect.top < 0,
      // Check if the element is out its container bottom boundary
      shiftY < 0 && rect.bottom - parentRect.bottom > 0,
    ];

    const canMoveOnY = isHigher || isOutTopBoundary || isOutBottomBoundary;
    if (canMoveOnY) {
      // prettier-ignore
      newPosY += this.getLimitedShift( shiftY, parentRect.top, parentRect.bottom, rect.top, rect.bottom);
    }

    const cursor = this.getCursor(canMoveOnX, canMoveOnY);

    this.setPos([newPosX, newPosY]);
    this._cursor = cursor;
    this._setTransitionDuration(transitionDuration);
  }

  /**
   * Check if the user is doing a double tap gesture.
   * @return {Boolean} Result of the checking
   */
  _isDoubleTapping() {
    const touchTime = new Date().getTime();
    // prettier-ignore
    const isDoubleTap = touchTime - (this._lastTouchTime ?? 0) < this._options.doubleTouchMaxDelay &&  touchTime - (this._lastDoubleTapTime ?? 0) > this._options.doubleTouchMaxDelay;

    if (isDoubleTap) {
      this._lastDoubleTapTime = touchTime;
      return true;
    }

    this._lastTouchTime = touchTime;
    return false;
  }

  /**
   * Trigger a decelerating movement after a mouse up or a touch end event, using the last movement shift.
   * @param  {Number} lastShiftOnX Last shift on the X axis in pixels
   * @param  {Number} lastShiftOnY Last shift on the Y axis in pixels
   */
  startDeceleration(lastShiftOnX: number, lastShiftOnY: number) {
    let startTimestamp: number | null = null;

    const startDecelerationMove = (timestamp: number) => {
      if (startTimestamp === null) startTimestamp = timestamp;

      const progress = timestamp - startTimestamp;

      // Calculates the ratio to apply on the move (used to create a non-linear deceleration)
      // prettier-ignore
      const ratio = (this._options.decelerationDuration - progress) / this._options.decelerationDuration;

      const [shiftX, shiftY] = [lastShiftOnX * ratio, lastShiftOnY * ratio];

      // Continue animation only if time has not expired and if there is still some movement (more than 1 pixel on one axis)
      // prettier-ignore
      if (progress < this._options.decelerationDuration && Math.max(Math.abs(shiftX), Math.abs(shiftY)) > 1) {
        this.move(shiftX, shiftY, 0);
        // prettier-ignore
        this._lastRequestAnimationId = requestAnimationFrame(startDecelerationMove);
      } else {
        this._lastRequestAnimationId = null;
      }
    };

    this._lastRequestAnimationId = requestAnimationFrame(startDecelerationMove);
  }

  /**
   * Event handler on double click.
   * @param  {MouseEvent} event Mouse event
   */
  handleDoubleClick(event: MouseEvent) {
    event.preventDefault();
    if (!this._options.allowZoom) return;

    if (this._zoom === this._options.minZoom) {
      this.fullZoomInOnPosition(event.pageX, event.pageY);
    } else {
      this.reset();
    }
  }

  /**
   * Event handler on scroll.
   * @param  {MouseEvent} event Mouse event
   */
  handleMouseWheel(event: WheelEvent) {
    event.preventDefault();
    if (!this._options.allowZoom || !this._options.allowWheel) return;

    // Use the scroll event delta to determine the zoom velocity
    const velocity = (-event.deltaY * this._options.scrollVelocity) / 100;

    // Set the new zoom level
    // prettier-ignore
    const newZoom = Math.max(Math.min(this._zoom + velocity, this._options.maxZoom), this._options.minZoom);

    let newPosition = this._position;
    if (newZoom !== this._zoom) {
      // prettier-ignore
      newPosition = newZoom !== this._options.minZoom ? this.getNewPosition(event.pageX, event.pageY, newZoom) : defaultPos
    }

    this.setZoom(newZoom);
    this.setPos(newPosition);
    this._setTransitionDuration(0.05);
  }

  /**
   * Event handler on mouse down.
   * @param  {MouseEvent} event Mouse event
   */
  handleMouseStart(event: MouseEvent) {
    event.preventDefault();
    // prettier-ignore
    if (!this._options.allowPan || this._options.ignoredMouseButtons.includes(event.button)) return;
    // prettier-ignore
    if (this._lastRequestAnimationId) cancelAnimationFrame(this._lastRequestAnimationId);
    this._lastCursor = [event.pageX, event.pageY];
  }

  /**
   * Event handler on mouse move.
   * @param  {MouseEvent} event Mouse event
   */
  handleMouseMove(event: MouseEvent) {
    event.preventDefault();

    if (!this._options.allowPan || !this._lastCursor) return;

    const [posX, posY] = [event.pageX, event.pageY];
    const shiftX = posX - this._lastCursor[0];
    const shiftY = posY - this._lastCursor[1];

    this.move(shiftX, shiftY, 0);

    this._lastCursor = [posX, posY];
    this._lastShift = [shiftX, shiftY];
  }

  /**
   * Event handler on mouse up or mouse out.
   * @param  {MouseEvent} event Mouse event
   */
  handleMouseStop(event: MouseEvent) {
    event.preventDefault();

    if (this._lastShift) {
      // Use the last shift to make a decelerating movement effect
      this.startDeceleration(this._lastShift[0], this._lastShift[1]);
      this._lastShift = null;
    }

    this._lastCursor = null;
    this._cursor = "auto";
  }

  /**
   * Event handler on touch start.
   * Zoom-in at the maximum scale if a double tap is detected.
   * @param  {TouchEvent} event Touch event
   */
  handleTouchStart(event: TouchEvent) {
    const isThisDoubleTapping = this._isDoubleTapping();
    const isMultiTouch = event.touches.length > 1;

    if (!this._options.allowTouchEvents) event.preventDefault();

    if (this._lastRequestAnimationId)
      cancelAnimationFrame(this._lastRequestAnimationId);

    const [posX, posY] = [event.touches[0].pageX, event.touches[0].pageY];

    if (isMultiTouch) {
      this._lastTouch = [posX, posY];
      return;
    }

    if (isThisDoubleTapping && this._options.allowZoom) {
      if (this._zoom === this._options.minZoom) {
        this.fullZoomInOnPosition(posX, posY);
      } else {
        this.reset();
      }

      return;
    }

    // Don't save the last touch if we are starting a simple touch move while panning is disabled
    if (this._options.allowPan) this._lastTouch = [posX, posY];
  }

  /**
   * Event handler on touch move.
   * Either move the element using one finger or zoom-in with a two finger pinch.
   * @param  {TouchEvent} event Touch move
   */
  handleTouchMove(event: TouchEvent) {
    if (!this._options.allowTouchEvents) event.preventDefault();
    if (!this._lastTouch) return;

    if (event.touches.length === 1) {
      const [posX, posY] = [event.touches[0].pageX, event.touches[0].pageY];
      // If we detect only one point, we shall just move the element
      const shiftX = posX - this._lastTouch[0];
      const shiftY = posY - this._lastTouch[1];

      this.move(shiftX, shiftY);
      this._lastShift = [shiftX, shiftY];

      // Save data for the next move
      this._lastTouch = [posX, posY];
      this._lastTouchDistance = null;
    } else if (event.touches.length > 1) {
      let newZoom = this._zoom;
      // If we detect two points, we shall zoom up or down
      const [pos1X, pos1Y] = [event.touches[0].pageX, event.touches[0].pageY];
      const [pos2X, pos2Y] = [event.touches[1].pageX, event.touches[1].pageY];
      // prettier-ignore
      const distance = Math.sqrt(Math.pow(pos2X - pos1X, 2) + Math.pow(pos2Y - pos1Y, 2));

      // prettier-ignore
      if (this._lastTouchDistance && distance && distance !== this._lastTouchDistance) {
        if (this._options.allowZoom) {
          newZoom += (distance - this._lastTouchDistance) / 100;
          if (newZoom > this._options.maxZoom) {
            newZoom = this._options.maxZoom;
          } else if (newZoom < this._options.minZoom) {
            newZoom = this._options.minZoom;
          }
        }

        // Change position using the center point between the two fingers
        const [centerX, centerY] = [(pos1X + pos2X) / 2, (pos1Y + pos2Y) / 2];
        const newPos = this.getNewPosition(centerX, centerY, newZoom);

        this.setZoom(newZoom);
        this.setPos(newPos);
        this._setTransitionDuration(0);
      }

      // Save data for the next move
      this._lastTouch = [pos1X, pos1Y];
      this._lastTouchDistance = distance;
    }
  }

  /**
   * Event handler on touch end or touch cancel.
   * @param  {TouchEvent} event Touch move
   */
  handleTouchStop() {
    if (this._lastShift) {
      // Use the last shift to make a decelerating movement effect
      this.startDeceleration(this._lastShift[0], this._lastShift[1]);
      this._lastShift = null;
    }

    this._lastTouch = null;
    this._lastTouchDistance = null;
  }

  private _events() {
    const hasMouseDevice = window.matchMedia("(pointer: fine)").matches;
    this.container?.addEventListener("wheel", this.handleMouseWheel, {
      passive: false,
    });

    this.container?.addEventListener("dblclick", this.handleDoubleClick, {
      passive: false,
    });

    if (hasMouseDevice) {
      // Apply mouse events only to devices which include an accurate pointing device
      this.container?.addEventListener("mousedown", this.handleMouseStart, {
        passive: false,
      });
      this.container?.addEventListener("mousemove", this.handleMouseMove, {
        passive: false,
      });
      this.container?.addEventListener("mouseup", this.handleMouseStop, {
        passive: false,
      });
      this.container?.addEventListener("mouseleave", this.handleMouseStop, {
        passive: false,
      });
    } else {
      // Apply touch events to all other devices
      this.container?.addEventListener("touchstart", this.handleTouchStart, {
        passive: false,
      });
      this.container?.addEventListener("touchmove", this.handleTouchMove, {
        passive: false,
      });
      this.container?.addEventListener("touchend", this.handleTouchStop, {
        passive: false,
      });
      this.container?.addEventListener("touchcancel", this.handleTouchStop, {
        passive: false,
      });
    }
  }

  /**
   * @description  Moves Element to the given position
   * @returns {Number} The current zoom value
   */
  private _setStyle() {
    if (!this.container) return;
    this.container.style.cssText += `
      cursor: cursor;
      will-change: transform;
      transition: transform ease-out ${this._options.animDuration}s;
      touch-action: ${this._options.allowParentPanning && this._zoom === 1 ? "pan-x pan-y" : "none"};
      transform: translate3d(${this._position[0]}px, ${this._position[1]}px, 0) scale(${this._zoom});
    `;
  }

  destroy() {
    // remove all event listeners
    if (this.container) {
      this.container?.removeEventListener("wheel", this.handleMouseWheel);
      const hasMouseDevice = window.matchMedia("(pointer: fine)").matches;
      this.container?.removeEventListener("dblclick", this.handleDoubleClick);

      if (hasMouseDevice) {
        this.container?.removeEventListener("mousedown", this.handleMouseStart);
        this.container?.removeEventListener("mousemove", this.handleMouseMove);
        this.container?.removeEventListener("mouseup", this.handleMouseStop);
        this.container?.removeEventListener("mouseleave", this.handleMouseStop);
      } else {
        // prettier-ignore
        this.container?.removeEventListener("touchstart",this.handleTouchStart);
        this.container?.removeEventListener("touchmove", this.handleTouchMove);
        this.container?.removeEventListener("touchend", this.handleTouchStop);
        // prettier-ignore
        this.container?.removeEventListener("touchcancel", this.handleTouchStop);
      }
    }

    this.container = null as unknown as HTMLElement;
  }

  reset() {
    if (!this.container) return;
    this.setZoom(this._options.initialZoom);
    this._cursor = defaultCursor;
    this._setTransitionDuration(this._options.animDuration);
    this.setPos(defaultPos);
  }
}

export default PrismaZoom;
