import IUser from "../shared/models/user";
import { EventBus } from "./eventbus";
import { Injectable } from "./injection";

export interface IState {
    user: IUser;
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
    userLoggedIn: false,
}

export
@Injectable()
class Store {
    private data: IState = defaultData;
    private bus: EventBus;

    public setData(path: string, value: any): void {
        let pathArray = path.split('.');
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
        this.bus.emitIfListenersExists(path, {...target[pathArray[0]] }); //Send copy to prevent change by link
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
        return typeof target !== "object" ? target : {...target};
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
