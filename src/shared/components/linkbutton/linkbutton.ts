import { BaseComponent, EVENTS } from "../../../framework/basecomponent";
import { Component } from "../../../framework/index";
import { default as template } from './linkbutton.html?raw';
import './linkbutton.scss';

@Component({
    selector: 'f-linkbutton',
    tagName: 'button',
    template: template,
})
export class FLinkButton extends BaseComponent {
    caption: string = '';
    class: string = "";
    id: string = "";

    constructor() {
        super();
        this.caption = this.innerText || this.getAttribute('caption') || '';
        this.innerText = '';
        this.eventBus.emit(EVENTS.INIT);
    }
}
