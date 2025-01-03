import { Message } from "../../shared/models/message";
import { BaseComponent, EVENTS } from "../../framework/basecomponent";
import { Component } from "../../framework/decorators";
import { default as template } from "./message.html?raw";
import "./message.scss";

@Component({
    selector: "f-message",
    tagName: "div",
    template: template,
})
export class FMessage extends BaseComponent {
    message: string = "";
    msg!: Message;

    constructor() {
        super();
        this.eventBus.emit(EVENTS.INIT);
        this.msg = new Message(JSON.parse(this.message));
        this.eventBus.emit(EVENTS.FLOW_CDU);
    }
}
