export interface IComponentConfig {
    selector: string;
    template: string;
    tagName?: string;
}

export interface ICallbackOptions {
    event: string;
}

export function Component(options: IComponentConfig) {
    return function (constructor: CustomElementConstructor) {
        constructor.prototype.template = options.template;
        constructor.prototype._meta = {
            tagName: options.tagName ?? "div",
            ...(options.selector && {
                selector: options.selector,
            }),
            props: {
                events: {},
            },
        };

        window.customElements.define(options.selector, constructor);
    };
}

// export function Singletone<T extends new (...args: any[]) => any>(ctr: T): T {

//     let instance: T;

//     return class {
//         constructor(...args: any[]) {

//             if (instance) {
//                 return instance;
//             }

//             instance = new ctr(...args);
//             return instance;
//         }
//     } as T
// }

