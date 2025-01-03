import { BaseComponent } from "./basecomponent";

export interface IComponentConfig {
    selector: string;
    template: string;
    tagName?: string;
}

export interface ICallbackOptions {
    event: string;
}

export function Component(options: IComponentConfig) {
    return function(constructor: CustomElementConstructor) {
        constructor.prototype.template = options.template;
        constructor.prototype._meta = {
            tagName: options.tagName ?? 'div',
            ...(options.selector && {
                selector: options.selector
            }),
            props: {
                events: {}
            }
        };

        window.customElements.define(options.selector, constructor);
    }
}
