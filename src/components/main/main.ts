import { BaseComponent, EVENTS } from "../../framework/basecomponent";
import { Component } from "../../framework/decorators";
import { Broadcast } from "../../framework/broadcast";
import { default as template } from "./main.html?raw";
import "./main.scss";

export enum ChatState {
    LOGIN = 0,
    REGISTER = 1,
    CHAT = 2,
    PROFILE = 3,
    NOT_FOUND = 4,
    SERVER_ERROR = 5,
}

@Component({
    tagName: "div",
    template: template,
    selector: "f-main",
})
export class FMain extends BaseComponent {
    state: ChatState = ChatState.LOGIN;

    constructor() {
        super();

        Broadcast.i.on("changestate", (state: ChatState) => {
            this.proxy.state = state;
        });

        this.eventBus.emit(EVENTS.INIT);
    }
}
