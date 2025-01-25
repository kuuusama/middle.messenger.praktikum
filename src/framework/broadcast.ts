import { EventBus } from "./eventbus";
import { Injectable } from "./injection";

export 
@Injectable()
class Broadcast {
    private eventBus: EventBus;

    public on(event: string, callback: Function) {
        this.eventBus.on(event, callback);
    }

    public off(event: string, callback: Function) {
        this.eventBus.off(event, callback);
    }

    public emit(event: string, ...args: unknown[]) {
        this.eventBus.emit(event, args);
    }

    private constructor() {
        this.eventBus = new EventBus();
    }
}
