export enum METHODS {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE",
}

export interface IOptions {
    headers?: {
        [key: string]: any;
    };
    method?: METHODS;
    timeout?: number;
    data?: Object & {
        [key: string]: any;
    };
}

function queryStringify(data: Object & { [key: string]: any }) {
    if (typeof data !== "object") {
        throw new Error("Data must be object");
    }

    const keys = Object.keys(data);
    return keys.reduce((result, key, index) => {
        return `${result}${key}=${data[key]}${index < keys.length - 1 ? "&" : ""}`;
    }, "?");
}

export class HTTP {
    get(url: string, options = { timeout: 5000 }) {
        return this.request(url, { ...options, method: METHODS.GET }, options.timeout);
    }

    post(url: string, options: IOptions = { timeout: 5000 }) {
        return this.request(url, { ...options, method: METHODS.POST }, options.timeout);
    }

    put(url: string, options = { timeout: 5000 }) {
        return this.request(url, { ...options, method: METHODS.PUT }, options.timeout);
    }

    delete(url: string, options = { timeout: 5000 }) {
        return this.request(url, { ...options, method: METHODS.DELETE }, options.timeout);
    }

    request(url: string, options: IOptions = {}, timeout = 5000) {
        const { headers = {}, method, data } = options;

        return new Promise(function (resolve, reject) {
            if (!method) {
                reject("No method");
                return;
            }

            const xhr = new XMLHttpRequest();
            const isGet = method === METHODS.GET;

            xhr.open(method, isGet && !!data ? `${url}${queryStringify(data)}` : url);

            Object.keys(headers).forEach((key) => {
                xhr.setRequestHeader(key, headers[key]);
            });

            xhr.onload = function () {
                if (xhr.readyState === 4) {
                    resolve(xhr.response);
                } else {
                    reject("Error");
                }
            };

            xhr.onabort = reject;
            xhr.onerror = reject;

            xhr.timeout = timeout;
            xhr.ontimeout = reject;

            if (isGet || !data) {
                xhr.send();
            } else {
                xhr.send(JSON.stringify(data));
            }
        });
    }

    requestWithRetry(url: string, options: { [key: string]: any } = {}): Promise<unknown> {
        const { tries = 1 } = options;

        function onError(err: string) {
            const triesLeft = tries - 1;
            if (!triesLeft) {
                throw err;
            }

            return HTTP.i.requestWithRetry(url, { ...options, tries: triesLeft });
        }

        return this.request(url, options).catch(onError.bind(this));
    }

    private static _instance: HTTP;
    public static get i() {
        return this._instance || (this._instance = new this());
    }

    private constructor() {}
}
