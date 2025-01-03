import { EventBus } from "./eventbus";

export class Broadcast {
    private static _instance: Broadcast;
    private eventBus: EventBus;

    public static get i(): Broadcast {
        return this._instance || (this._instance = new this)
    }

    public on(event: string, callback: Function) {
        this.eventBus.on(event, callback);
    }

    public off(event: string, callback: Function) {
        this.eventBus.off(event, callback);
    }

    public emit(event: string, ...args: any[]) {
        this.eventBus.emit(event, args);
    }

    private constructor() {
        this.eventBus = new EventBus();
    }
}