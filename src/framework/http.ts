import IUser from "../shared/models/user";
import { Inject, Injectable } from "./injection";
import { Router } from "./router";

type StData = object & { [key: string]: string | number | undefined } | IUser;
type RawData = Document | XMLHttpRequestBodyInit | string | null | undefined;

export enum METHODS {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE",
}

export interface IOptions {
    headers?: {
        [key: string]: string;
    };
    method?: METHODS;
    timeout?: number;
    withCredentials?: boolean;
    data?: StData | RawData;
    tries?: number;
}

function queryStringify(data: StData ) {
    if (typeof data !== "object") {
        throw new Error("Data must be object");
    }

    const keys = Object.keys(data);
    return keys.reduce((result, key, index) => {

        const safeValue = data[key] ? encodeURIComponent(data[key]) : '';
        return `${result}${key}=${safeValue}${index < keys.length - 1 ? "&" : ""}`;
    }, "?");
}

export
@Injectable()
class HTTP {
    @Inject('Router') private router!: Router;

    public get(url: string, options = { timeout: 5000 }): Promise<unknown> {
        return this.request(url, { ...options, method: METHODS.GET });
    }

    public post(url: string, options: IOptions = { timeout: 5000 }): Promise<unknown> {
        return this.request(url, { ...options, method: METHODS.POST });
    }

    public put(url: string, options = { timeout: 5000 }): Promise<unknown> {
        return this.request(url, { ...options, method: METHODS.PUT });
    }

    public delete(url: string, options = { timeout: 5000 }): Promise<unknown> {
        return this.request(url, { ...options, method: METHODS.DELETE });
    }

    private request(url: string, options: IOptions = {}): Promise<unknown> {
        const { headers = {}, method, data, timeout, withCredentials = true } = options;

        return new Promise( (resolve, reject) => {
            if (!method) {
                reject("No method");
                return;
            }

            const xhr = new XMLHttpRequest();

            xhr.withCredentials = withCredentials;

            const isGet = method === METHODS.GET;

            xhr.open(method, isGet && !!data ? `${url}${queryStringify(data as unknown as StData)}` : url);

            Object.keys(headers).forEach((key) => {
                xhr.setRequestHeader(key, headers[key]);
            });

            xhr.onload = () => {
                if (xhr.readyState === 4) {
                    if(xhr.status === 401) {
                        this.router.go('/');
                        reject(xhr.status);
                    } else if(xhr.status === 404) {
                        this.router.go('/404');
                        reject(xhr.status);
                    } else if(xhr.status === 451) {
                        this.router.go('/451');
                        reject(xhr.status);
                    } else if(xhr.status >= 500) {
                        this.router.go('/500');
                        reject(xhr.status);
                    } else if(xhr.status > 399) {
                        reject(JSON.parse(xhr.response));
                    }
                    else {
                        resolve(xhr.response);
                    }                    
                } else {
                    reject("Error");
                }
            };

            xhr.onprogress = function(event) {
                console.log(`${event.type}: ${event.loaded} bytes transferred\n`);
            }

            xhr.onabort = reject;
            xhr.onerror = reject;

            xhr.timeout = timeout || 5000;
            xhr.ontimeout = reject;

            if (isGet || !data) {
                xhr.send();
            } else {
               xhr.send(headers['Content-Type'] === 'application/json' ? JSON.stringify(data) : data as RawData);
            }
        });
    }

    public requestWithRetry(url: string, options: IOptions): Promise<unknown> {
        const { tries = 1 } = options;

        const onError = (err: string) => {
            const triesLeft = tries - 1;
            if (!triesLeft) {
                throw err;
            }

            return this.requestWithRetry(url, { ...options, tries: triesLeft });
        }

        return this.request(url, options).catch(onError.bind(this));
    }

    private constructor() {}
}
