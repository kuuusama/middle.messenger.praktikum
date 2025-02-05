import IChat from "../shared/models/chat";
import IUser from "../shared/models/user";
import { EventBus } from "./eventbus";
import { Injectable } from "./injection";

export interface IState {
    user: IUser;
    userLoggedIn: boolean,
    chats: Array<IChat>,
    currentChatId: number,
    currentChatUsers: IUser[],
    [key: string]: any; //It is really can be anything.
}

const defaultData = {
    user: {
        email: "",
        login: "",
        first_name: "",
        second_name: "",
        display_name: "",
        phone: "",
        avatar: "",
        password: "123456",
    },
    chats: [],
    userLoggedIn: false,
    currentChatId: 0,
    currentChatUsers: [],
}

export
@Injectable()
class Store {
    private data: IState = defaultData;
    private bus: EventBus;

    private getCopy(original: unknown): unknown {
        const copy = Array.isArray(original) ? 
            [...original] :
            typeof original === 'object' ?
            {...original } : original;

        return copy;
    }

    public setData(path: string, value: any): void {
        const pathArray = path.split('.');
        let target = this.data;
        while (pathArray.length - 1) {
            const key = pathArray.shift();
            if (key) {
                if (!(key in target)) {
                    target[key] = {}
                } 
                target = target[key];
            }
        }
        target[pathArray[0]] = value;

        const result = this.getCopy(target[pathArray[0]]); //Send copy to prevent change by link

        this.bus.emitIfListenersExists(path, result); 
    }

    public getData(path: string): any {
        const pathArray = path.split(".");
        let target = this.data;
        for (let i = 0; i < pathArray.length; i++) {
            if (target[pathArray[i]]) {
                target = target[pathArray[i]];
            } else {
                return undefined
            }
        }
        return this.getCopy(target); //Send copy to prevent change by link
    }

    public on(path: string, listener: Function) {
        this.bus.on(path, listener);

        //To get the current value immediately.
        listener(this.getData(path));
    }

    public off(event: string, listener: Function) {
        this.bus.off(event, listener);
    }

    private constructor() {
        this.bus = new EventBus();
    }
}
