import { BaseComponent, EVENTS } from "../../framework/basecomponent";
import { Broadcast } from "../../framework/broadcast";
import { Component } from "../../framework/decorators";
import { Contact } from "../../shared/models/contact";
import { default as template } from "./contact.html?raw";
import "./contact.scss";

@Component({
    selector: "f-contact",
    tagName: "div",
    template: template,
})
export class FContact extends BaseComponent {
    contact: string = "";
    cnt!: Contact;

    selectContact() {
        Broadcast.i.emit("select_contact", this.cnt.id);
    }

    constructor() {
        super();
        this.eventBus.emit(EVENTS.INIT);
        this.cnt = new Contact(JSON.parse(this.contact));
        this.eventBus.emit(EVENTS.FLOW_CDU);
        const elem = this.getElementsByClassName("contact").item(0);
        elem?.addEventListener("click", this.selectContact.bind(this));
    }
}
