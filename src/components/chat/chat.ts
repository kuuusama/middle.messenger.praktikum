import { BaseComponent, EVENTS } from "../../framework/basecomponent";
import { Broadcast } from "../../framework/broadcast";
import { Component } from "../../framework/decorators";
import { Inject } from "../../framework/injection";
import { Store } from "../../framework/store";
import IChat from "../../shared/models/chat";
import { default as template } from "./chat.html?raw";
import "./chat.scss";

@Component({
    selector: "f-chat",
    tagName: "div",
    template: template,
})
export class FChat extends BaseComponent {
    @Inject(Broadcast.name) private broadcast!: Broadcast;
    @Inject(Store.name) private store!: Store;
    
    chat: string = "";
    _chat!: IChat;

    selectContact() {
        this.broadcast.emit("select_contact", this._chat.id);
        this.store.setData('currentChatId', this._chat.id);
    }

    constructor() {
        super();
        this.eventBus.emit(EVENTS.INIT);
        this._chat = JSON.parse(this.chat);
        const lastMessageDate = new Date(this._chat.last_message.time);
        this._chat.last_message.time = lastMessageDate.toTimeString().split(' ')[0].slice(0, -3);
        this.eventBus.emit(EVENTS.FLOW_CDU);
        const elem = this.getElementsByClassName("chat").item(0);
        elem?.addEventListener("click", this.selectContact.bind(this));
    }
}
