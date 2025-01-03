import { BaseComponent, EVENTS } from "../../../framework/basecomponent";
import { Component } from "../../../framework/index";
import { default as template } from './fbutton.html?raw';
import './fbutton.scss';

@Component({
    selector: 'f-button',
    tagName: 'button',
    template: template,
})
export class FButton extends BaseComponent {
    caption: string = '';

    constructor() {
        super();
        this.caption = this.innerText || this.getAttribute('caption') || '';
        this.innerText = '';
        this.eventBus.emit(EVENTS.INIT);
    }
}