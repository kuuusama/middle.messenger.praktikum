import { BaseComponent, EVENTS } from "../../framework/basecomponent";
import { Broadcast } from "../../framework/broadcast";
import { Component } from "../../framework/decorators";
import { ChatState } from "../main/main";
import { default as template } from './500.html?raw';
import './500.scss';

@Component({
    selector: 'f-servererror',
    tagName: 'div',
    template: template,
})
export class FServerError extends BaseComponent {
    returnToChat() {
        Broadcast.i.emit('changestate', ChatState.CHAT);
    }
    
    constructor() {
        super();
        this.eventBus.emit(EVENTS.INIT);
    }
}
