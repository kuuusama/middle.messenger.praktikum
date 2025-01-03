import { EventBus } from "./eventbus";
import Handlebars from "handlebars";

export enum EVENTS {
    INIT = 'init',
    FLOW_CDM = 'flow:component-did-mount',
    FLOW_RENDER = 'flow:render',
    FLOW_CDU = 'flow:component-did-update',
};

export class Props {
    [key: string]: any;
    events: {
        [key: string]: any;
    } = {}
}

export class Meta {
    tagName: string = "div";
    selector?: string;
    props: Props = {
        events: {}
    }
}

export interface Listener {
    elementId: string;
    eventName: string;
    listener: Function;
}

const elementAttrs = ['href', 'target', 'type', 'id'];

export abstract class BaseComponent extends HTMLElement {
    template: string = '';

    _element!: HTMLElement;
    _meta!: Meta;
    eventBus: EventBus;
    props: Props;
    [key: string]: any;
    listeners?: Array<Listener>;

    constructor() {
        super();

        Handlebars.registerHelper('ifeq', function(a: any, b: any, options: any) {
            if(a == b) {return options.fn(this)};
        });

        Handlebars.registerHelper('ifor', function(a: any, b: any, options: any) {
            if(a || b) {return options.fn(this)};
        });

        Handlebars.registerHelper('ifNotBoth', function(a: any, b: any, options: any) {
            if(!a && !b) {return options.fn(this)};
        });

        Handlebars.registerHelper('ifBoth', function(a: any, b: any, options: any) {
            if(a && b) {return options.fn(this)};
        });

        Handlebars.registerHelper('json', function(context) {
            return JSON.stringify(context);
        });

        this.template = this.constructor.prototype.template;
        this.style.display = 'contents';
        this.eventBus = new EventBus();

        this.proxy = this._makePropsProxy(this);
        this._registerEvents(this.eventBus);
    }

    _registerEvents(eventBus: EventBus) {
        eventBus.on(EVENTS.INIT, this.init.bind(this));
        eventBus.on(EVENTS.FLOW_CDM, this._componentDidMount.bind(this));
        eventBus.on(EVENTS.FLOW_CDU, this._componentDidUpdate.bind(this));
        eventBus.on(EVENTS.FLOW_RENDER, this._render.bind(this));
    }

    private _change(event: any): void {
        this.proxy.value = event.target.value;

        setTimeout(() => {
            const tgt = document.getElementsByName(event.target.name)[0] as HTMLInputElement;
            if(tgt) {
                tgt.focus();
                tgt.selectionStart = tgt.selectionEnd = tgt.value.length;
            }
        }, 0);
    }

    public getParentComponent(node: HTMLElement): BaseComponent | undefined {
        let result = node.parentElement;
        if (result) {
            if (result instanceof BaseComponent) {
                return result;
            } else {
                return this.getParentComponent(result);
            }
        }
    }

    _assignEvents(): void {
        const parent = this.getParentComponent(this) as HTMLElement & {[key: string]: any};

        let element = this._element;

        if (this._meta.selector  === 'f-input') {
            const input = this._element.getElementsByTagName('input')[0];
            if(input) {
                element = input;
                element.addEventListener('input', this.debounce(this._change.bind(this), 400));
            }
        }

        this.getAttributeNames().forEach((attr) => {
            if ('(' === attr.charAt(0) && ')' === attr.charAt(attr.length - 1)) {
                const eventName = attr.substring(1, attr.length - 1);
                const eventHandler = this.getAttribute(attr) || null;

                if(eventHandler && parent) {
                    element.addEventListener(eventName, parent[eventHandler].bind(parent));
                }
            }
        });

        if (this.listeners) {
            this.listeners.forEach((config) => {
                document.getElementById(config.elementId)?.addEventListener(config.eventName, config.listener.bind(this));
            });
        }
    }

    _assignAttributes(): void {
        this.getAttributeNames().forEach((attr) => {
            if ('[' === attr.charAt(0) && ']' === attr.charAt(attr.length - 1)) {
                const attrName = attr.substring(1, attr.length - 1);
                const value = this.getAttribute(attr);

                this[attrName] = value;

                if ('class' === attrName && value) {
                    const classes = value.split(' ');
                    classes.forEach((cls: string) => {
                        this._element.classList.add(cls);
                        this.classList.add(cls);
                    });
                }

                if (elementAttrs.includes(attrName) && value) {
                    this._element.setAttribute(attrName, value);
                }
            }
        })
    }
  
    _createResources() {
        const { tagName } = this._meta;
        this._element = this._createDocumentElement(tagName);
        this._element.classList.add(this.constructor.name.toLowerCase());
        this.append(this._element);
        this._assignAttributes();
    }
  
    init() {
        this._createResources();
        this.eventBus.emit(EVENTS.FLOW_RENDER);
    }
  
    _componentDidMount() {
        this.componentDidMount(this.props);
    }

    private debounce(mainFunction: Function, delay: number) {
        let timer: NodeJS.Timeout;
      
        return function (...args: any[]) {
            clearTimeout(timer);
            timer = setTimeout(() => {
                mainFunction(...args);
            }, delay);
        };
    };
  
    // Может переопределять пользователь, необязательно трогать
    componentDidMount(oldProps: Props) {}
  
    dispatchComponentDidMount() {
      this.eventBus.emit(EVENTS.FLOW_CDM);
    }
  
    _componentDidUpdate(oldProps: Props, newProps: Props) {
        const response = this.componentDidUpdate(oldProps, newProps);
        if (response) {
            this._render();
        }
    }
  
    // Может переопределять пользователь, необязательно трогать
    componentDidUpdate(oldProps: Props, newProps: Props) {
        return true;
    }
  
    setProps (nextProps: Props) {
        if (!nextProps) {
            return;
        }
    
        Object.assign(this.props, nextProps);
    };
  
    get element() {
      return this._element;
    }
  
    _render() {
        const block = this.render();
        this._element.innerHTML = block;
        this._assignEvents();
    }

    private render(): string {
        const _template = Handlebars.compile(this.template);
        return _template(this, {
            allowedProtoMethods: {
                stateLogin: true
              }
        });
    }
  
    getContent() {
        return this.element;
    }

    proxy: BaseComponent;
  
    _makePropsProxy(props: BaseComponent): BaseComponent {
        const self = this;

        const handler = {
            get(target: any, prop: any) {
                const value = target[prop];
                return typeof value === "function" ? value.bind(target) : value;
            },

            set(target: any, prop: any, value: any) {
                target[prop] = value;

                if (elementAttrs.includes(prop) && value) {
                    self._element.setAttribute(prop, value);
                }    

                self.eventBus.emit(EVENTS.FLOW_CDU, {...target}, target);
                return true;
            },

            deleteProperty() {
                throw new Error("Нет доступа");
            }
        };
    
        return new Proxy(props, handler);
    };
  
    _createDocumentElement(tagName: string): HTMLElement {
        return document.createElement(tagName);
    }

    show() {
        this.style.display = "contents";
    }
  
    hide() {
        this.style.display = "none";
    }
}
