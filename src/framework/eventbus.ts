export class EventBus {
    listeners: {
        [key: string]: Function[]
    }; //We don't know here, which listeners will be created.

    constructor() {
        this.listeners = {};
    }

    on(event: string, callback: Function) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
    }

    off(event: string, callback: Function) {
        if (!this.listeners[event]) {
            throw new Error(`Нет события: ${event}`);
        }

        this.listeners[event] = this.listeners[event].filter((listener: Function) => listener !== callback);
    }

    emit(event: string, ...args: unknown[]) {
        if (!this.listeners[event]) {
            throw new Error(`Нет события: ${event}`);
        }

        this.listeners[event].forEach((listener: Function) => {
            listener(...args);
        });
    }

    emitIfListenersExists(event: string, ...args: unknown[]) {
        if (this.listeners[event]) {
            this.listeners[event].forEach((listener: Function) => {
                listener(...args);
            }); 
        }
    }
}
