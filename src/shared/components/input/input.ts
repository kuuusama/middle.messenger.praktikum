import { BaseComponent, EVENTS } from "../../../framework/basecomponent";
import { Component } from "../../../framework/index";
import { default as template } from './input.html?raw';
import './input.scss';

@Component({
    selector: 'f-input',
    tagName: 'div',
    template: template,
})
export class FInput extends BaseComponent {
    label: string = "";
    error: string = "";
    type: string = "text";
    name: string = "";
    class: string = "";
    id: string = "";

    constructor() {
        super();
        this.eventBus.emit(EVENTS.INIT)
    }
}
