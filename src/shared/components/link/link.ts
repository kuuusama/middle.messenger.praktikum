import { BaseComponent, EVENTS } from "../../../framework/basecomponent";
import { Component } from "../../../framework/index";
import { default as template } from "./link.html?raw";
import "./link.scss";

@Component({
    selector: "f-link",
    tagName: "a",
    template: template,
})
export class FLink extends BaseComponent {
    caption: string = "";
    href: string = "";
    class: string = "";
    id: string = "";

    constructor() {
        super();
        this.caption = this.innerText || this.getAttribute("caption") || "";
        this.innerText = "";
        this.eventBus.emit(EVENTS.INIT);
    }
}
