import { BaseComponent, EVENTS } from "../../framework/basecomponent";
import { Broadcast } from "../../framework/broadcast";
import { Component } from "../../framework/decorators";
import { ChatState } from "../main/main";
import { default as template } from "./404.html?raw";
import "./404.scss";

@Component({
    tagName: "div",
    template: template,
    selector: "f-notfound",
})
export class FNotFound extends BaseComponent {
    returnToChat() {
        Broadcast.i.emit("changestate", ChatState.CHAT);
    }

    constructor() {
        super();
        this.eventBus.emit(EVENTS.INIT);
    }
}
