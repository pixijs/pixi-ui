/// <reference types="node" />
/// <reference types="pixi.js" />
import * as PIXI from 'pixi.js';

/**
 * Alignments supported by layout managers in PuxiJS core.
 *
 * @memberof PUXI
 * @enum
 */
export declare enum ALIGN {
    LEFT = 0,
    TOP = 0,
    MIDDLE = 4081,
    CENTER = 4081,
    RIGHT = 1048561,
    BOTTOM = 1048561,
    NONE = 4294967295
}

/**
 * `AnchorLayout` is used in conjunction with `AnchorLayoutOptions`.
 *
 * @memberof PUXI
 * @class
 * @example
 * ```
 * parent.useLayout(new PUXI.AnchorLayout());
 * ```
 */
export declare class AnchorLayout implements ILayoutManager {
    private measuredWidth;
    private measuredHeight;
    private host;
    protected noPercents: boolean;
    constructor();
    onAttach(host: WidgetGroup): void;
    onDetach(): void;
    private measureChild;
    measureStretch(lowerAnchor: number, upperAnchor: number, childDimen: number): number;
    measureChildren(maxParentWidth: number, maxParentHeight: number, widthMode: MeasureMode, heightMode: MeasureMode): void;
    onMeasure(maxWidth: number, maxHeight: number, widthMode: MeasureMode, heightMode: MeasureMode): void;
    getMeasuredWidth(): number;
    getMeasuredHeight(): number;
    onLayout(): void;
}

/**
 * Anchored layout-options specify the left, top, right, and bottom offsets of a
 * widget in pixels. If an offset is between -1px and 1px, then it is interpreted
 * as a percentage of the parent's dimensions.
 *
 * The following example will render a widget at 80% of the parent's width and
 * 60px height.
 * ```js
 * const widget: PUXI.Widget = new Widget();
 * const anchorPane: PUXI.Widget = new Widget();
 *
 * widget.layoutOptions = new PUXI.AnchoredLayoutOptions(
 *      .10,
 *      .90,
 *      20,
 *      80
 * );
 *
 * // Prevent child from requesting natural bounds.
 * widget.layoutOptions.width = 0;
 * widget.layoutOptions.height = 0;
 * ```
 *
 * ### Intra-anchor region constraints
 *
 * If the offsets given provide a region larger than the widget's dimensions, then
 * the widget will be aligned accordingly. However, if the width or height of the
 * child is set to 0, then that child will be scaled to fit in the entire region
 * in that dimension.
 *
 * @memberof PUXI
 * @extends PUXI.LayoutOptions
 * @class
 */
export declare class AnchorLayoutOptions extends LayoutOptions {
    anchorLeft: number;
    anchorTop: number;
    anchorRight: number;
    anchorBottom: number;
    horizontalAlign: ALIGN;
    verticalAlign: ALIGN;
    constructor(anchorLeft: number, anchorTop: number, anchorRight: number, anchorBottom: number, horizontalAlign?: ALIGN, verticalAlign?: ALIGN);
}

/**
 * Button that can be clicked.
 *
 * @memberof PUXI
 * @class
 * @extends PUXI.FocusableWidget
 */
export declare class Button extends FocusableWidget {
    isHover: boolean;
    protected textWidget: TextWidget;
    click: () => void;
    /**
     * @param [options.background}] {(PIXI.UI.SliceSprite|PIXI.UI.Sprite)} will be used as background for Button
     * @param [options.text=null] {PIXI.UI.Text} optional text
     * @param [options.tabIndex=0] {Number} input tab index
     * @param [options.tabGroup=0] {Number|String} input tab group
     * @param [options.width=options.background.width] {Number|String} width
     * @param [options.height=options.background.height] {Number|String} height
     */
    constructor(options: IButtonOptions);
    private setupClick;
    update(): void;
    initialize(): void;
    /**
     * Label for this button.
     * @member {string}
     */
    get value(): string;
    set value(val: string);
    get text(): any;
    set text(val: any);
}

/**
 * @memberof PUXI
 * @typedef {string} CheckGroup
 */
declare interface CBGroup {
    checks: Array<CheckBox>;
    selected: CheckBox;
}

/**
 * @memberof PUXI
 * @extends PUXI.IFocusableOptions
 * @member {boolean} checked
 * @member {PIXI.Container}[checkmark]
 * @member {PUXI.CheckGroup}[checkGroup]
 * @member {string}[value]
 */
/**
 * A checkbox is a button can be selected (checked). It has a on/off state that
 * can be controlled by the user.
 *
 * When used in a checkbox group, the group will control whether the checkbox can
 * be selected or not.
 *
 * @memberof PUXI
 * @class
 * @extends PUXI.FocusableWidget
 */
export declare class CheckBox extends FocusableWidget {
    private _checked;
    private _value;
    private label;
    private checkmark;
    checkGroup: CheckGroup;
    /**
     * @param {PUXI.ICheckBoxOptions} options
     * @param [options.checked=false] {bool} is checked
     * @param options.background {(PIXI.UI.SliceSprite|PIXI.UI.Sprite)} will be used as background for CheckBox
     * @param options.checkmark {(PIXI.UI.SliceSprite|PIXI.UI.Sprite)} will be used as checkmark for CheckBox
     * @param {PUXI.CheckGroup}[options.checkGroup=null] CheckGroup name
     * @param options.value {String} mostly used along with checkgroup
     * @param [options.tabIndex=0] {Number} input tab index
     * @param [options.tabGroup=0] {Number|String} input tab group
     */
    constructor(options: ICheckBoxOptions);
    update(): void;
    get checked(): boolean;
    set checked(val: boolean);
    get value(): string;
    set value(val: string);
    get selectedValue(): string;
    initialize(): void;
    protected change: (val: boolean) => void;
    protected click: () => void;
}

/**
 * Check boxes use this controller to deselect other checkboxes in the group when
 * they are selected.
 *
 * @memberof PUXI
 * @class
 * @extends PUXI.Controller
 */
declare class CheckBoxGroupController extends Controller<CheckBox> {
    protected checkGroups: Map<CheckGroup, CBGroup>;
    constructor(stage: Stage);
    /**
     * @param {PUXI.CheckBox} widget
     * @param {PUXI.CheckGroup} checkGroup
     * @override
     */
    in(widget: CheckBox, checkGroup?: CheckGroup): void;
    /**
     * @override
     */
    out(widget: CheckBox): void;
    /**
     * Called when a checkbox is selected. Do not call from outside.
     *
     * @param {CheckBox} widget
     */
    notifyCheck(widget: CheckBox): void;
    /**
     * @param {PUXI.CheckGroup} group
     * @returns {CheckBox} the selected checkbox in the group
     */
    getSelected(group: CheckGroup): CheckBox;
    /**
     * Ensures that the check group exists in `this.checkGroups`.
     *
     * @param {PUXI.CheckGroup} id
     * @protected
     */
    protected initGroup(id: CheckGroup): CBGroup;
}

declare type CheckGroup = string;

/**
 * `ClickManager` handles hover and click events. It registers listeners
 * for `mousedown`, `mouseup`, `mousemove`, `mouseout`, `mouseover`, `touchstart`,
 * `touchend`, `touchendoutside`, `touchmove`, `rightup`, `rightdown`, `rightupoutside`
 * events.
 *
 * @memberof PUXI
 * @class
 * @extends PUXI.EventManager
 */
export declare class ClickManager extends EventManager {
    onHover: (event: PIXI.interaction.InteractionEvent, over: boolean) => void;
    onPress: (event: PIXI.interaction.InteractionEvent, isPressed: boolean) => void;
    onClick: (event: PIXI.interaction.InteractionMouseEvents) => void;
    onMove: (event: PIXI.interaction.InteractionEvent) => void;
    protected _rightMouseButton: boolean;
    protected _includeHover: boolean;
    protected _doubleClick: boolean;
    private bound;
    private id;
    private ishover;
    protected target: Widget;
    private movementX;
    private movementY;
    mouse: PIXI.Point;
    offset: PIXI.Point;
    private evMouseDown;
    private evMouseUp;
    private evMouseUpOutside;
    time: number;
    /**
     * @param {PUXI.Widget | PUXI.Button} target
     * @param {boolean}[includeHover=false] - enable hover (`mouseover`, `mouseout`) listeners
     * @param {boolean}[rightMouseButton=false] - use right mouse clicks
     * @param {boolean}[doubleClick=false] - fire double clicks
     */
    constructor(target: Widget, includeHover?: boolean, rightMouseButton?: any, doubleClick?: boolean);
    /**
     * Whether right mice are used for clicks rather than left mice.
     * @member boolean
     */
    get rightMouseButton(): boolean;
    set rightMouseButton(val: boolean);
    /**
     * @param {boolean}[includeHover]
     * @param {boolean}[rightMouseButton]
     * @param {boolean}[doubleClick]
     * @override
     */
    startEvent: (includeHover?: boolean, rightMouseButton?: boolean, doubleClick?: boolean) => void;
    /**
     * @override
     */
    stopEvent: () => void;
    protected onMouseDownImpl: (event: PIXI.interaction.InteractionEvent) => void;
    protected onMouseUpCommonImpl: (event: PIXI.interaction.InteractionEvent) => void;
    protected onMouseUpImpl: (event: any) => void;
    protected onMouseUpOutsideImpl: (event: any) => void;
    protected onMouseOverImpl: (event: any) => void;
    protected onMouseOutImpl: (event: any) => void;
    protected onMouseMoveImpl: (event: any) => void;
}

declare abstract class Controller<T> extends PIXI.utils.EventEmitter {
    stage: Stage;
    constructor(stage: Stage);
    abstract in(widget: T): any;
    abstract out(widget: T): any;
}

export declare function create(fn: any): any;

/**
 * `DragManager` handles drag & drop events. It registers listeners for `mousedown`,
 * `touchstart` on the target and `mousemove`, `touchmove`, `mouseup`, `mouseupoutside`,
 * `touchend`, `touchendoutside` on the stage.
 *
 * By default, `draggable` widgets will internally handle drag-n-drop and reassigning
 * the callbacks on their `DragManager` will break their behaviour. You can prevent
 * this by using `eventBroker.dnd` directly without setting `widget.draggable` to
 * `true` (or using `widget.makeDraggable()`).
 *
 * @memberof PUXI
 * @class
 * @extends PUXI.EventManager
 */
declare class DragManager extends EventManager {
    protected isBound: boolean;
    protected isDragging: boolean;
    protected id: number;
    protected dragStart: PIXI.Point;
    protected dragOffset: PIXI.Point;
    protected lastCursor: PIXI.Point;
    protected movementX: number;
    protected movementY: number;
    protected cancel: boolean;
    onPress: (e: PIXI.interaction.InteractionEvent, isPressed: boolean) => void;
    onDragStart: (e: PIXI.interaction.InteractionEvent) => void;
    onDragMove: (e: PIXI.interaction.InteractionEvent, dragOffset: PIXI.Point) => void;
    onDragEnd: (e: PIXI.interaction.InteractionEvent) => void;
    constructor(target: Widget);
    startEvent(): void;
    stopEvent(): void;
    protected onDragStartImpl: (e: PIXI.interaction.InteractionEvent) => void;
    private onDragMoveImpl;
    private onDragEndImpl;
}

export declare namespace Ease {
    { Linear };
    export namespace Power0 {
        { Linear as easeNone };
    }
    export namespace Power1 {
        { easeInFunction as easeIn };
        { easeOutFunction as easeOut };
        { easeInOutFunction as easeInOut };
    }
    export namespace Quad { }
    export namespace Power2 { }
    export namespace Cubic { }
    export namespace Power3 { }
    export namespace Quart { }
    export namespace Power4 { }
    export namespace Quint { }
    export namespace Bounce {
        const BounceIn: any;
        const BounceOut: any;
        const BounceInOut: any;
    }
    export namespace Circ {
        const CircIn: any;
        const CircOut: any;
        const CircInOut: any;
    }
    export namespace Expo {
        const ExpoIn: any;
        const ExpoOut: any;
        const ExpoInOut: any;
    }
    export namespace Sine {
        const SineIn: any;
        const SineOut: any;
        const SineInOut: any;
    }
}

declare class EaseBase {
    getPosition(p: any): any;
}

/**
 * The event brokers allows you to access event managers without manually assigning
 * them to a widget. By default, the click (`PUXI.ClickManager`), dnd (`PUXI.DragManager`)
 * are defined. You can add event managers for all (new) widgets by adding an entry to
 * `EventBroker.MANAGER_MAP`.
 *
 * @memberof PUXI
 * @class
 */
export declare class EventBroker {
    [key: string]: EventManager | Widget;
    constructor(target: Widget);
    static MANAGER_MAP: {
        click: typeof ClickManager;
        dnd: typeof DragManager;
    };
}

/**
 * An event manager handles the states related to certain events and can augment
 * widget interaction. For example, the click manager will hide clicks when
 * the object is dragging.
 *
 * Event managers are lifecycle objects - they can start/stop. Their constructor
 * will always accept one argument - the widget. Other settings can be applied before
 * `startEvent`.
 *
 * Ideally, you should access event managers _after_ your widget has initialized. This is
 * because it may depend on the widget's stage being assigned.
 *
 * @memberof PUXI
 * @class
 * @abstract
 */
export declare abstract class EventManager {
    protected target: Widget;
    protected isEnabled: boolean;
    /**
     * @param {Widget} target
     */
    constructor(target: Widget);
    /**
     * @returns {Widget}
     */
    getTarget(): Widget;
    /**
     * Registers the interaction event listeners that will emit corresponding events
     * on the target widget.
     */
    abstract startEvent(): any;
    /**
     * Unregisters any event listeners and releases any resources held. This should
     * revert all changes made by `startEvent`.
     */
    abstract stopEvent(): any;
}

/**
 * `PUXI.FastLayout` is used in conjunction with `PUXI.FastLayoutOptions`. It is the
 * default layout for most widget groups.
 *
 * @memberof PUXI
 * @class
 * @extends PUXI.ILayoutManager
 * @example
 * ```
 * parent.useLayout(new PUXI.FastLayout())
 * ```
 */
export declare class FastLayout implements ILayoutManager {
    private host;
    private _measuredWidth;
    private _measuredHeight;
    onAttach(host: WidgetGroup): void;
    onDetach(): void;
    onMeasure(maxWidth: number, maxHeight: number, widthMode: MeasureMode, heightMode: MeasureMode): void;
    private getChildMeasureMode;
    private measureWidthReach;
    private measureHeightReach;
    private measureChildFillers;
    onLayout(): void;
    getMeasuredWidth(): number;
    getMeasuredHeight(): number;
}

/**
 * `PUXI.FastLayoutOptions` is an extension to `PUXI.LayoutOptions` that also
 * defines the x & y coordinates. It is accepted by the stage and `PUXI.FastLayout`.
 *
 * If x or y is between -1 and 1, then that dimension will be interpreted as a
 * percentage of the parent's width or height.
 *
 * @memberof PUXI
 * @extends PUXI.LayoutOptions
 * @class
 */
export declare class FastLayoutOptions extends LayoutOptions {
    static DEFAULT_ANCHOR: PIXI.Point;
    static CENTER_ANCHOR: PIXI.Point;
    x: number;
    y: number;
    anchor: PIXI.Point;
    constructor(width: number, height: number, x?: number, y?: number, anchor?: PIXI.Point);
}

/**
 * Represents a view that can gain or loose focus. It is primarily subclassed by
 * input/form widgets.
 *
 * Generally, it is a good idea not use layouts on these types of widgets.
 *
 * @class
 * @extends PUXI.Widget
 * @memberof PUXI
 */
declare abstract class FocusableWidget extends InteractiveGroup {
    _isFocused: boolean;
    _isMousePressed: boolean;
    tabIndex: number;
    tabGroup: TabGroup;
    /**
     * @param {PUXI.IInputBaseOptions} options
     * @param {PIXI.Container}[options.background]
     * @param {number}[options.tabIndex]
     * @param {any}[options.tabGroup]
     */
    constructor(options?: IFocusableOptions);
    /**
     * Brings this widget into focus.
     */
    focus(): void;
    /**
     * Brings this widget out of focus.
     */
    blur(): void;
    /**
     * Whether this widget is in focus.
     * @member {boolean}
     * @readonly
     */
    get isFocused(): boolean;
    private bindEvents;
    private clearEvents;
    protected onKeyDownImpl: (e: any) => void;
    private onDocumentPointerDownImpl;
    initialize(): void;
}

/**
 * Pressing tab on a focused widget will make the next widget its tab group
 * focused. If no tab group is specified for a focusable widget, then it
 * has the `'default'` tab group.
 *
 * @memberof PUXI
 * @typedef {string} TabGroup
 */
/**
 * @memberof PUXI
 * @class
 * @extends PUXI.Controller
 */
declare class FocusController extends Controller<FocusableWidget> {
    stage: Stage;
    protected tabGroups: Map<TabGroup, FocusableWidget[]>;
    protected currentItem: FocusableWidget;
    useTab: boolean;
    useForward: boolean;
    useBack: boolean;
    constructor(stage: Stage);
    /**
     * Adds the (focusable) widget to the tab group so that pressing tab repeatedly
     * will eventually bring it into focus.
     *
     * @param {PUXI.FocusableWidget} widget - the widget to add
     * @param {number}[tabIndex=0] - unique index for the widget in tab group used for ordering
     * @param {PUXI.TabGroup}[tabGroup='default'] - tab group name
     */
    in(widget: FocusableWidget, tabIndex?: number, tabGroup?: string): void;
    /**
     * @param {PUXI.FocusableWidget} widget
     * @override
     */
    out(widget: FocusableWidget): void;
    /**
     * Called when a widget comes into focus. Do not call this yourself.
     *
     * @param {FocusableWidget} widget
     */
    notifyFocus(widget: FocusableWidget): void;
    /**
     * Clears the currently focused item without blurring it. It is called
     * when a widget goes out of focus.
     */
    notifyBlur(): void;
    /**
     * Brings the widget into focus.
     *
     * @param {FocusableWidget} item
     */
    focus(item: FocusableWidget): void;
    /**
     * Blurs the currently focused widget out of focus.
     */
    blur(): void;
    /**
     * Called when tab is pressed on a focusable widget.
     */
    onTab(): void;
    /**
     * Focuses the next item without wrapping, i.e. it does not go to the first
     * item if the current one is the last item. This is called when the user
     * presses the forward arrow key.
     */
    onForward(): void;
    /**
     * Focuses the last item without wrapping, i.e. it does not go to the last
     * item if the current item is the first one. This is called when the user
     * presses the back arrow button.
     */
    onBack(): void;
}

export declare const Helpers: {
    Lerp(start: number, stop: number, amt: number): number;
    Round(number: number, decimals: number): number;
    componentToHex(c: any): string;
    rgbToHex(r: number, g: number, b: number): string;
    rgbToNumber(r: number, g: number, b: number): number;
    numberToRgb(c: number): any;
    hexToRgb(hex: any): any;
};

/**
 * @memberof PUXI
 * @interface
 * @extends PUXI.IFocusableOptions
 * @property {PUXI.TextWidget | string} text
 */
declare interface IButtonOptions extends IFocusableOptions {
    background?: PIXI.Container;
    text?: TextWidget | string;
    tabIndex?: number;
    tabGroup?: any;
}

declare interface ICheckBoxOptions extends IFocusableOptions {
    checked?: boolean;
    background: PIXI.Container;
    checkmark?: PIXI.Container;
    checkGroup?: CheckGroup;
    value?: string;
    tabIndex?: number;
    tabGroup?: number;
}

/**
 * @namespace PUXI
 * @interface
 * @property {PIXI.Container}[background]
 * @property {number}[tabIndex]
 * @property {PUXI.TabGroup}[tabGroup]
 */
declare interface IFocusableOptions {
    background?: PIXI.Container;
    tabIndex?: number;
    tabGroup?: any;
}

export declare interface ILayoutManager extends IMeasurable {
    onAttach(host: WidgetGroup): void;
    onDetach(): void;
    onLayout(): void;
}

export declare interface IMeasurable {
    onMeasure(maxWidth: number, maxHeight: number, widthMode: MeasureMode, heightMode: MeasureMode): any;
    getMeasuredWidth(): number;
    getMeasuredHeight(): number;
}

/**
 * @memberof PUXI
 * @class
 */
export declare class Insets {
    left: number;
    top: number;
    right: number;
    bottom: number;
    dirtyId: number;
    constructor();
    reset(): void;
}

/**
 * An interactive container.
 *
 * @class
 * @extends PUXI.WidgetGroup
 * @memberof PUXI
 */
export declare class InteractiveGroup extends WidgetGroup {
    private hitArea;
    constructor();
    update(): void;
    layout(l: number, t: number, r: number, b: number, dirty: boolean): void;
}

declare interface IScrollBarOptions {
    track: Sprite;
    handle: Sprite;
    scrollingContainer: ScrollWidget;
    vertical?: boolean;
    autohide?: boolean;
}

/**
 * @namespace PUXI
 * @interface
 */
declare interface IScrollingContainerOptions {
    scrollX?: boolean;
    scrollY?: boolean;
    dragScrolling?: boolean;
    softness?: number;
    radius?: number;
    expandMask?: number;
    overflowY?: number;
    overflowX?: number;
}

declare interface ISliderOptions {
    track?: Sprite;
    handle?: Sprite;
    fill?: Sprite;
    vertical?: boolean;
    value?: number;
    minValue?: number;
    maxValue?: number;
    decimals?: number;
    onValueChange?: () => void;
    onValueChanging?: () => void;
}

/**
 * @memberof PUXI
 * @interface
 */
declare interface ITextInputOptions extends IFocusableOptions {
    multiLine?: boolean;
    style?: PIXI.TextStyle;
    background?: PIXI.Container;
    selectedColor?: string | number[];
    selectedBackgroundColor?: string;
    width?: number;
    height?: number;
    padding?: number;
    paddingTop?: number;
    paddingBottom?: number;
    paddingLeft?: number;
    paddingRight?: number;
    tabIndex?: number;
    tabGroup?: number;
    maxLength?: number;
    caretWidth?: number;
    lineHeight?: number;
    value?: string;
}

/**
 * This are the base constraints that you can apply on a `PUXI.Widget` under any
 * layout manager. It specifies the dimensions of a widget, while the position
 * of the widget is left to the parent to decide. If a dimension (width or height)
 * is set to a value between -1 and 1, then it is interpreted as a percentage
 * of the parent's dimension.
 *
 * The following example will render a widget at 50% of the parent's width and 10px height:
 *
 * ```js
 * const widget = new PUXI.Widget();
 * const parent = new PUXI.Widget();
 *
 * widget.layoutOptions = new PUXI.LayoutOptions(
 *      .5,
 *      10
 * );
 * parent.addChild(widget);
 * ```
 *
 * @memberof PUXI
 * @class
 */
export declare class LayoutOptions {
    static FILL_PARENT: number;
    static WRAP_CONTENT: number;
    static MAX_DIMEN: number;
    static DEFAULT: LayoutOptions;
    width: number;
    height: number;
    markers: any;
    private _marginLeft;
    private _marginTop;
    private _marginRight;
    private _marginBottom;
    /**
     * @param {number}[width = LayoutOptions.WRAP_CONTENT]
     * @param {number}[height = LayoutOptions.WRAP_CONTENT]
     */
    constructor(width?: number, height?: number);
    /**
     * The left margin in pixels of the widget.
     * @member {number}
     * @default 0
     */
    get marginLeft(): number;
    set marginLeft(val: number);
    /**
     * This top margin in pixels of the widget.
     * @member {number}
     * @default 0
     */
    get marginTop(): number;
    set marginTop(val: number);
    /**
     * The right margin in pixels of the widget.
     * @member {number}
     * @default 0
     */
    get marginRight(): number;
    set marginRight(val: number);
    /**
     * The bottom margin in pixels of the widget.
     * @member {number}
     * @default 0
     */
    get marginBottom(): number;
    set marginBottom(val: number);
    setMargin(left: number, top: number, right: number, bottom: number): void;
}

/**
 * These are the modes in which an entity can measures its dimension. They are
 * relevant when a layout needs to know the optimal sizes of its children.
 *
 * @memberof PUXI
 * @enum
 * @property {number} UNBOUNDED - no upper limit on bounds. This should calculate the optimal dimensions for the entity.
 * @property {number} EXACTLY - the entity should set its dimension to the one passed to it.
 * @property {number} AT_MOST - the entity should find an optimal dimension below the one passed to it.
 */
export declare enum MeasureMode {
    UNBOUNDED = 0,
    EXACTLY = 1,
    AT_MOST = 2
}

/**
 * @memberof PUXI
 * @interface IScrollBarOptions
 * @property {PUXI.Sprite} track
 * @property {PUXI.Sprite} handle
 */
/**
 * An UI scrollbar to control a ScrollingContainer
 *
 * @class
 * @extends PUXI.Slider
 * @memberof PUXI
 * @param options {Object} ScrollBar settings
 * @param options.track {(PIXI.UI.SliceSprite|PIXI.UI.Sprite)}  Any type of UIOBject, will be used for the scrollbar track
 * @param options.handle {(PIXI.UI.SliceSprite|PIXI.UI.Sprite)} will be used as scrollbar handle
 * @param options.scrollingContainer {PIXI.UI.ScrollingContainer} The container to control
 * @param [options.vertical=false] {boolean} Direction of the scrollbar
 * @param [options.autohide=false] {boolean} Hides the scrollbar when not needed
 */
export declare class ScrollBar extends Slider {
    scrollingContainer: ScrollWidget;
    autohide: boolean;
    _hidden: boolean;
    constructor(options: IScrollBarOptions);
    initialize(): void;
    alignToContainer(): void;
    toggleHidden(hidden: boolean): void;
}

/**
 * Handles the `wheel` and `scroll` DOM events on widgets. It also registers
 * listeners for `mouseout` and `mouseover`.
 *
 * @memberof PUXI
 * @class
 * @extends PUXI.EventManager
 */
export declare class ScrollManager extends EventManager {
    private bound;
    private delta;
    private preventDefault;
    constructor(target: Widget, preventDefault?: boolean);
    /**
     * @override
     */
    startEvent(): void;
    /**
     * @override
     */
    stopEvent(): void;
    private onMouseScrollImpl;
    private onHoverImpl;
    private onMouseOutImpl;
    onMouseScroll: (event: any, delta: PIXI.Point) => void;
}

/**
 * `ScrollWidget` masks its contents to its layout bounds and translates
 * its children when scrolling.
 *
 * @memberof PUXI
 * @class
 * @extends PUXI.InteractiveGroup
 */
export declare class ScrollWidget extends InteractiveGroup {
    private mask;
    private innerContainer;
    private innerBounds;
    scrollX: boolean;
    scrollY: boolean;
    dragScrolling: boolean;
    softness: number;
    radius: number;
    expandMask: number;
    overflowY: number;
    overflowX: number;
    animating: boolean;
    scrolling: boolean;
    _scrollBars: any[];
    private boundCached;
    private lastWidth;
    private lastHeight;
    protected scrollPosition: PIXI.Point;
    protected scrollVelocity: PIXI.Point;
    protected targetPosition: PIXI.Point;
    protected lastPosition: PIXI.Point;
    protected stop: boolean;
    /**
     * @param {PUXI.IScrollingContainerOptions} options
     * @param [options.scrollX=false] {Boolean} Enable horizontal scrolling
     * @param [options.scrollY=false] {Boolean} Enable vertical scrolling
     * @param [options.dragScrolling=true] {Boolean} Enable mousedrag scrolling
     * @param [options.softness=0.5] {Number} (0-1) softness of scrolling
     * @param [options.width=0] {Number|String} container width
     * @param [options.height=0] {Number} container height
     * @param [options.radius=0] {Number} corner radius of clipping mask
     * @param [options.expandMask=0] {Number} mask expand (px)
     * @param [options.overflowY=0] {Number} how much can be scrolled past content dimensions
     * @param [options.overflowX=0] {Number} how much can be scrolled past content dimensions
     */
    constructor(options?: IScrollingContainerOptions);
    /**
     * Updates the mask and scroll position before rendering.
     *
     * @override
     */
    update(): void;
    /**
     * @param {PUXI.Widget[]} newChildren
     * @returns {ScrollWidget} this widget
     */
    addChild(...newChildren: Widget[]): Widget;
    updateScrollBars(): void;
    getInnerBounds(force?: boolean): PIXI.Rectangle;
    /**
     * @override
     */
    initialize(): void;
    private initScrolling;
    forcePctPosition: (direction: string, pct: number) => void;
    focusPosition: (pos: PIXI.Point) => void;
    /**
     * @param {PIXI.Point}[velocity]
     */
    setScrollPosition: (velocity?: PIXI.Point) => void;
    /**
     * @param {number} delta
     * @protected
     */
    protected updateScrollPosition: (delta: number) => void;
    /**
     * @param {'x' | 'y'} direction
     * @param {number} delta
     * @protected
     */
    protected updateDirection: (direction: string, delta: number) => void;
}

/**
 * A sliced sprite with dynamic width and height.
 *
 * @class
 * @memberof PUXI
 * @param Texture {PIXI.Texture} the texture for this SliceSprite
 * @param BorderWidth {Number} Width of the sprite borders
 * @param horizontalSlice {Boolean} Slice the sprite horizontically
 * @param verticalSlice {Boolean} Slice the sprite vertically
 * @param [tile=false] {Boolean} tile or streach
 */
export declare class SliceSprite extends Widget {
    ftl: PIXI.Rectangle;
    ftr: PIXI.Rectangle;
    fbl: PIXI.Rectangle;
    fbr: PIXI.Rectangle;
    ft: PIXI.Rectangle;
    fb: PIXI.Rectangle;
    fr: PIXI.Rectangle;
    fl: PIXI.Rectangle;
    ff: PIXI.Rectangle;
    stl: PIXI.Sprite;
    str: PIXI.Sprite;
    sbl: PIXI.Sprite;
    sbr: PIXI.Sprite;
    st: PIXI.Sprite;
    sb: PIXI.Sprite;
    sl: PIXI.Sprite;
    sr: PIXI.Sprite;
    sf: PIXI.Sprite;
    bw: number;
    vs: boolean;
    hs: boolean;
    t: PIXI.BaseTexture;
    f: PIXI.Rectangle;
    tile: any;
    constructor(texture: PIXI.Texture, borderWidth: any, horizontalSlice: any, verticalSlice: any, tile: any);
    initialize(): void;
    update(): void;
}

/**
 * These options are used to configure a `PUXI.Slider`.
 *
 * @memberof PUXI
 * @interface ISliderOptions
 * @property {PIXI.Container}[track]
 * @property {PIXI.Container}[fill]
 * @property {boolean}[vertical]
 * @property {number}[value]
 * @property {number}[minValue]
 * @property {number}[maxValue]
 * @property {number}[decimals]
 * @property {Function}[onValueChange]
 * @property {Function}[onValueChanging]
 */
/**
 * An UI Slider, the default width/height is 90%
 *
 * @memberof PUXI
 * @class
 * @extends PUXI.Widget
 */
export declare class Slider extends Widget {
    protected _amt: number;
    protected _disabled: boolean;
    track: Sprite;
    handle: Sprite;
    fill: Sprite;
    _minValue: number;
    _maxValue: number;
    decimals: number;
    vertical: boolean;
    _lastChange: number;
    _lastChanging: number;
    onValueChange: (number: any) => void;
    onValueChanging: (number: any) => void;
    /**
     * @param options {Object} Slider settings
     * @param options.track {(PIXI.UI.SliceSprite|PIXI.UI.Sprite)}  Any type of UIOBject, will be used for the slider track
     * @param options.handle {(PIXI.UI.SliceSprite|PIXI.UI.Sprite)} will be used as slider handle
     * @param [options.fill=null] {(PIXI.UI.SliceSprite|PIXI.UI.Sprite)} will be used for slider fill
     * @param [options.vertical=false] {boolean} Direction of the slider
     * @param [options.value=0] {number} value of the slider
     * @param [options.minValue=0] {number} minimum value
     * @param [options.maxValue=100] {number} max value
     * @param [options.decimals=0] {boolean} the decimal precision (use negative to round tens and hundreds)
     * @param [options.onValueChange=null] {callback} Callback when the value has changed
     * @param [options.onValueChanging=null] {callback} Callback while the value is changing
     */
    constructor(options: ISliderOptions);
    update(soft?: number): void;
    initialize(): void;
    get value(): number;
    set value(val: number);
    get minValue(): number;
    set minValue(val: number);
    get maxValue(): number;
    set maxValue(val: number);
    get disabled(): boolean;
    set disabled(val: boolean);
}

/**
 * An UI Container object
 *
 * @memberof PUXI
 * @class
 * @extends PUXI.Widget
 * @param desc {Boolean} Sort the list descending
 * @param tweenTime {Number} if above 0 the sort will be animated
 * @param tweenEase {PIXI.UI.Ease} ease method used for animation
 */
export declare class SortableList extends InteractiveGroup {
    desc: boolean;
    tweenTime: number;
    tweenEase: EaseBase;
    items: any[];
    _sortTimeout: NodeJS.Timeout;
    constructor(desc: any, tweenTime: any, tweenEase: any);
    addChild(UIObject: any, fnValue?: any, fnThenBy?: any): void;
    removeChild(UIObject: any): void;
    sort(instant?: boolean): void;
    _sort(): void;
}

/**
 * An UI sprite object
 *
 * @memberof PUXI
 * @class
 * @extends PUXI.Widget
 */
export declare class Sprite extends Widget {
    private spriteDisplay;
    constructor(texture: PIXI.Texture);
    update(): void;
    static fromImage(imageUrl: any): Sprite;
}

/**
 * The stage is the root node in the PUXI scene graph. It does not provide a
 * sophisticated layout model; however, it will accept constraints defined by
 * `PUXI.FastLayoutOptions` or `PUXI.LayoutOptions` in its children.
 *
 * The stage is not a `PUXI.Widget` and its dimensions are always fixed.
 *
 * @memberof PUXI
 * @class
 * @extends PIXI.Container
 */
export declare class Stage extends PIXI.Container {
    __width: number;
    __height: number;
    minWidth: number;
    minHeight: number;
    initialized: boolean;
    widgetChildren: Widget[];
    stage: any;
    private _checkBoxGroupCtl;
    private _focusCtl;
    protected background: PIXI.Container;
    /**
     * @param {number} width - width of the stage
     * @param {number} height - height of the stage
     */
    constructor(width: number, height: number);
    protected measureAndLayout(): void;
    getBackground(): PIXI.Container;
    setBackground(bg: PIXI.Container): void;
    private update;
    render(renderer: PIXI.Renderer): void;
    addChild(UIObject: Widget): void;
    removeChild(UIObject: Widget): void;
    resize(width?: number, height?: number): void;
    get width(): number;
    set width(val: number);
    get height(): number;
    set height(val: number);
    /**
     * The check box group controller for check boxes in this stage.
     *
     * @member {PUXI.CheckBoxGroupController}
     */
    get checkBoxGroupController(): CheckBoxGroupController;
    /**
     * The focus controller for widgets in this stage. You can use this to bring a
     * widget into focus.
     *
     * @member {PUXI.FocusController}
     */
    get focusController(): FocusController;
    /**
     * Use this to override which class is used for the check box group controller. It
     * should extend from `PUXI.CheckBoxGroupController`.
     *
     * @static
     */
    static CHECK_BOX_GROUP_CONTROLLER: typeof CheckBoxGroupController;
    /**
     * Use this to override which class is used for the focus controller. It should
     * extend from `PUXI.FocusController`.
     *
     * @static
     */
    static FOCUS_CONTROLLER: typeof FocusController;
}

declare type TabGroup = string;

/**
 * An UI text object
 *
 * @class
 * @extends PIXI.UI.InputBase
 * @memberof PIXI.UI
 */
export declare class TextInput extends FocusableWidget {
    private options;
    private _dirtyText;
    private _value;
    private _lastValue;
    private _lastWidth;
    private _lastHeight;
    private selection;
    private textContainer;
    maxLength: number;
    private chars;
    private multiLine;
    private color;
    private selectedColor;
    private selectedBackgroundColor;
    private tempText;
    private textHeight;
    private lineHeight;
    private caret;
    private caretInterval;
    private si;
    private sie;
    private ei;
    private eie;
    private sp;
    private ds;
    private de;
    private rdd;
    private vrdd;
    private selectionStart;
    private selectionEnd;
    private hasSelection;
    private t;
    private cc;
    private textLengthPX;
    private textHeightPX;
    private lineIndexMax;
    private ctrlDown;
    private shiftDown;
    private shiftKey;
    private ctrlKey;
    private cmdKey;
    private _sp;
    /**
     * @param {PUXI.ITextInputOptions} options
     * @param {string} options.value Text content
     * @param {boolean} [options.multiLine=false] Multiline input
     * @param options.style {PIXI.TextStyle} Style used for the Text
     * @param options.background {(PIXI.UI.SliceSprite|PIXI.UI.Sprite)} will be used as background for input
     * @param [options.selectedColor='#ffffff'] {String|Array} Fill color of selected text
     * @param [options.selectedBackgroundColor='#318cfa'] {String} BackgroundColor of selected text
     * @param [options.width=150] {Number} width of input
     * @param [options.height=20] {Number} height of input
     * @param [options.padding=3] {Number} input padding
     * @param [options.paddingTop=0] {Number} input padding
     * @param [options.paddingBottom=0] {Number} input padding
     * @param [options.paddingLeft=0] {Number} input padding
     * @param [options.paddingRight=0] {Number} input padding
     * @param [options.tabIndex=0] {Number} input tab index
     * @param [options.tabGroup=0] {Number|String} input tab group
     * @param [options.maxLength=0] {Number} 0 = unlimited
     * @param [options.caretWidth=1] {Number} width of the caret
     * @param [options.lineHeight=0] {Number} 0 = inherit from text
     */
    constructor(options: ITextInputOptions);
    setupDrag(): void;
    private get innerContainer();
    update(): void;
    updateText(): void;
    updateClosestIndex(point: PIXI.Point, start: boolean): void;
    deleteSelection(): boolean;
    updateSelectionColors(): void;
    scrollToPosition(pos: PIXI.Point): void;
    resetScrollPosition(): void;
    hideCaret(): void;
    showCaret(): void;
    insertTextAtCaret(c: string): void;
    onKeyDown: (e: any) => void;
    keyUpEvent: (e: any) => void;
    copyEvent: (e: any) => void;
    cutEvent: (e: any) => void;
    pasteEvent: (e: any) => void;
    inputEvent: (e: any) => void;
    inputBlurEvent: (e: any) => void;
    focus: () => void;
    blur: () => void;
    setCaretIndex: (index: number) => void;
    select: () => void;
    selectWord: (wordIndex: number) => void;
    selectRange: (startIndex: number, endIndex: number) => void;
    clearSelection: () => void;
    updateSelectionGraphics: () => void;
    drawSelectionRect: (x: number, y: number, w: number, h: number) => void;
    get valueEvent(): string;
    set valueEvent(val: string);
    get value(): string;
    set value(val: string);
    get text(): string;
    set text(value: string);
}

/**
 * A static text widget. It cannot retain children.
 *
 * @memberof PUXI
 * @class
 * @extends PUXI.Widget
 */
export declare class TextWidget extends Widget {
    private textDisplay;
    /**
     * @param {string} text - text content
     * @param {PIXI.TextStyle} textStyle - styled used for text
     */
    constructor(text: string, textStyle: PIXI.TextStyle);
    update(): void;
    get value(): string;
    set value(val: string);
    get text(): string;
    set text(val: string);
}

/**
 * This ticker is an event-emitter that can be used for running periodic tasks
 * in the rendering loop. It emits the `update` event every animation frame.
 *
 * @memberof PUXI
 * @class
 * @extends PIXI.utils.EventEmitter
 */
export declare class Ticker extends PIXI.utils.EventEmitter {
    private _disabled;
    private _now;
    DeltaTime: number;
    Time: number;
    Ms: number;
    constructor(autoStart: boolean);
    get disabled(): boolean;
    set disabled(val: boolean);
    /**
     * Updates the text
     *
     * @private
     */
    update(time: number): void;
    /**
     * The update event is fired periodically and it can be used to for a rendering
     * loop.
     * @event update
     * @param {DOMHighResTimeStamp} deltaTime - milliseconds since last update
     */
    static shared: Ticker;
    static on(event: any, fn: Function, context: any): void;
    static once(event: any, fn: Function, context: any): void;
    static removeListener(event: any, fn: Function): void;
}

/**
 * An UI sprite object
 *
 * @class
 * @extends PIXI.UI.UIBase
 * @memberof PIXI.UI
 * @param Texture {PIXI.Texture} The texture for the sprite
 * @param [Width=Texture.width] {number} Width of tilingsprite
 * @param [Height=Texture.height] {number} Height of tiling sprite
 */
export declare class TilingSprite extends Widget {
    protected sprite: PIXI.extras.TilingSprite;
    constructor(t: any, width: number, height: number);
    /**
     * Updates the text
     *
     * @private
     */
    update(): void;
    get tilePosition(): any;
    set tilingPosition(val: any);
    get tileScale(): number;
    set tileScale(val: number);
}

export declare const Tween: {
    to(obj: any, time: any, params: any, ease?: any): void;
    from(obj: any, time: any, params: any, ease: any): void;
    fromTo(obj: any, time: any, paramsFrom: any, paramsTo: any, ease: any): void;
    set(obj: any, params: any): void;
    _update(delta: any): void;
};

/**
 * A widget is a user interface control that renders content inside its prescribed
 * rectangle on the screen.
 *
 * @memberof PUXI
 * @class
 * @extends PIXI.utils.EventEmitter
 * @implements PUXI.IMeasurable
 */
export declare abstract class Widget extends PIXI.utils.EventEmitter implements IMeasurable {
    insetContainer: PIXI.Container;
    contentContainer: PIXI.Container;
    widgetChildren: Widget[];
    stage: Stage;
    initialized: boolean;
    protected dragInitialized: boolean;
    protected dropInitialized: boolean;
    protected isDragging: boolean;
    private draggable;
    private droppable;
    dirty: boolean;
    _oldWidth: number;
    _oldHeight: number;
    pixelPerfect: boolean;
    parent: Widget;
    _parentWidth: number;
    _parentHeight: number;
    layoutMeasure: Insets;
    layoutOptions: LayoutOptions;
    protected tint: number;
    protected blendMode: PIXI.BLEND_MODES;
    protected background: PIXI.Container;
    protected _measuredWidth: number;
    protected _measuredHeight: number;
    private _eventBroker;
    private _paddingLeft;
    private _paddingTop;
    private _paddingRight;
    private _paddingBottom;
    private _width;
    private _height;
    private _elevation;
    private _dropShadow;
    constructor();
    /**
     * Update method that is to be overriden. This is called before a `render()`
     * pass on widgets that are dirty.
     *
     * @private
     */
    abstract update(): any;
    /**
     * The measured width that is used by the parent's layout manager to place this
     * widget.
     * @member {number}
     */
    get measuredWidth(): number;
    /**
     * The measured height that is used by the parent's layout manager to place this
     * widget.
     * @member {number}
     */
    get measuredHeight(): number;
    /**
     * Alias for `Widget.measuredWidth`.
     *
     * @returns {number} the measured width
     */
    getMeasuredWidth(): number;
    /**
     * Alias for `Widget.measuredHeight`.
     *
     * @returns {number} the measured height
     */
    getMeasuredHeight(): number;
    /**
     * Override this method to measure the dimensions for your widget. By default, it
     * will use the natural width/height of this widget's content (`contentContainer`)
     * plus any padding.
     *
     * @param {number} width - width of region provided by parent
     * @param {number} height - height of region provided by parent
     * @param {PUXI.MeasureMode} widthMode - mode in which provided width is to be used
     * @param {PUXI.MeasureMode} heightMode - mode in which provided height is to be used
     */
    onMeasure(width: number, height: number, widthMode: MeasureMode, heightMode: MeasureMode): void;
    /**
     * This method calls `Widget.onMeasure` and should not be overriden. It does internal
     * bookkeeping.
     *
     * @param {number} width
     * @param {number} height
     * @param {PUXI.MeasureMode} widthMode
     * @param {PUXI.MeasureMode} heightMode
     */
    measure(width: number, height: number, widthMode: MeasureMode, heightMode: MeasureMode): void;
    /**
     * This method should set the frame in which rendering will occur and lay out
     * child widgets in that frame.
     *
     * @param l
     * @param t
     * @param r
     * @param b
     * @param dirty
     * @protected
     */
    layout(l: number, t?: number, r?: number, b?: number, dirty?: boolean): void;
    /**
     * Use this to specify how you want to layout this widget w.r.t its parent.
     * The specific layout options class depends on which layout you are
     * using in the parent widget.
     *
     * @param {PUXI.LayoutOptions} lopt
     * @returns {Widget} this
     */
    setLayoutOptions(lopt: LayoutOptions): Widget;
    /**
     * The event broker for this widget that holds all the event managers. This can
     * be used to start/stop clicks, drags, scrolls and configure how those events
     * are handled/interpreted.
     * @member PUXI.EventBroker
     */
    get eventBroker(): EventBroker;
    /**
     * Padding on left side.
     * @member {number}
     */
    get paddingLeft(): number;
    set paddingLeft(val: number);
    /**
     * Padding on top side.
     * @member {number}
     */
    get paddingTop(): number;
    set paddingTop(val: number);
    /**
     * Padding on right side.
     * @member {number}
     */
    get paddingRight(): number;
    set paddingRight(val: number);
    /**
     * Padding on bottom side.
     * @member {number}
     */
    get paddingBottom(): number;
    set paddingBottom(val: number);
    /**
     * Sum of left & right padding.
     * @member {number}
     * @readonly
     */
    get paddingHorizontal(): number;
    /**
     * Sum of top & bottom padding.
     * @member {number}
     * @readonly
     */
    get paddingVertical(): number;
    /**
     * Whether this widget is interactive in the PixiJS scene graph.
     * @member {boolean}
     */
    get interactive(): boolean;
    set interactive(val: boolean);
    /**
     * Layout width of this widget.
     * @member {number}
     */
    get width(): number;
    /**
     * Layout height of this widget.
     * @member {number}
     */
    get height(): number;
    /**
     * Alpha of this widget & its contents.
     * @member {number}
     */
    get alpha(): number;
    set alpha(val: number);
    /**
     * Sets the padding values.
     *
     * To set all paddings to one value:
     * ```
     * widget.setPadding(8);
     * ```
     *
     * To set horizontal & vertical padding separately:
     * ```
     * widget.setPadding(4, 12);
     * ```
     *
     * @param {number}[l=0] - left padding
     * @param {number}[t=l] - top padding (default is equal to left padding)
     * @param {number}[r=l] - right padding (default is equal to right padding)
     * @param {number}[b=t] - bottom padding (default is equal to top padding)
     */
    setPadding(l: number, t?: number, r?: number, b?: number): Widget;
    /**
     * @returns {PIXI.Container} - the background display-object
     */
    getBackground(): PIXI.Container;
    /**
     * The background of a widget is a `PIXI.DisplayObject` that is rendered before
     * all of its children.
     *
     * @param {PIXI.Container | number | string} bg - the background display-object or
     *     a color that will be used to generate a `PIXI.Graphics` as the background.
     */
    setBackground(bg: PIXI.Container | number | string): Widget;
    /**
     * @returns {number} the alpha on the background display-object.
     */
    getBackgroundAlpha(): number;
    /**
     * This can be used to set the alpha on the _background_ of this widget. This
     * does not affect the widget's contents nor individual components of the
     * background display-object.
     *
     * @param {number} val - background alpha
     */
    setBackgroundAlpha(val: number): Widget;
    /**
     * @return {number} the elevation set on this widget
     */
    getElevation(): number;
    /**
     * This can be used add a drop-shadow that will appear to raise this widget by
     * the given elevation against its parent.
     *
     * @param {number} val - elevation to use. 2px is good for most widgets.
     */
    setElevation(val: number): Widget;
    /**
     * Adds the widgets as children of this one.
     *
     * @param {PUXI.Widget[]} widgets
     * @returns {Widget} - this widget
     */
    addChild(...widgets: Widget[]): Widget;
    /**
     * Orphans the widgets that are children of this one.
     *
     * @param {PUXI.Widget[]} widgets
     * @returns {Widget} - this widget
     */
    removeChild(...widgets: Widget[]): Widget;
    /**
     * Makes this widget `draggable`.
     */
    makeDraggable(): Widget;
    /**
     * Makes this widget not `draggable`.
     */
    clearDraggable(): void;
    /**
     * Widget initialization related to the stage. This method should always call
     * `super.initialize()`.
     *
     * This method expects `stage` to be set before calling it. This is handled
     * by the `Stage` itself.
     *
     * This will set `initialized` to true. If it was already set to true, it _should
     * do nothing_.
     *
     * @protected
     */
    initialize(): void;
    private initDraggable;
    /**
     * Makes this widget `droppable`.
     */
    makeDroppable(): Widget;
    protected onDrop: (e: PIXI.interaction.InteractionEvent) => void;
    /**
     * Makes this widget not `droppable`.
     */
    clearDroppable(): void;
    private initDroppable;
}

/**
 * A widget group is a layout owner that can position its children according
 * to the layout given to it.
 *
 * @memberof PUXI
 * @class
 * @extends PUXI.Widget
 * @example
 * ```
 * const group = new PUXI.InteractiveGroup();
 *
 * group.useLayout(new PUXI.AnchorLayout());
 *
 * group.addChild(new PUXI.Button({ text: "Hey" })
 *  .setLayoutOptions(
 *      new PUXI.AnchorLayoutOptions(
 *             100,
 *             300,
 *             .4,
 *             500,
 *             PUXI.ALIGN.CENTER
 *      )
 *  )
 * )
 * ```
 */
export declare abstract class WidgetGroup extends Widget {
    layoutMgr: ILayoutManager;
    /**
     * Will set the given layout-manager to be used for positioning child widgets.
     *
     * @param {PUXI.ILayoutManager} layoutMgr
     */
    useLayout(layoutMgr: ILayoutManager): void;
    /**
     * Sets the widget-recommended layout manager. By default (if not overriden by widget
     * group class), this is a fast-layout.
     */
    useDefaultLayout(): void;
    measure(width: number, height: number, widthMode: MeasureMode, heightMode: MeasureMode): void;
    layout(l: number, t: number, r: number, b: number, dirty?: boolean): void;
}

export declare function wrapEase(easeInFunction: any, easeOutFunction: any, easeInOutFunction: any): {
    easeIn: any;
    easeOut: any;
    easeInOut: any;
};

export { }
