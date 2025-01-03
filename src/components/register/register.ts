import { BaseComponent, EVENTS } from "../../framework/basecomponent";
import { Broadcast } from "../../framework/broadcast";
import { Component } from "../../framework/decorators";
import { NetworkService } from "../../framework/network";
import Validator from "../../framework/validator";
import { ChatState } from "../main/main";
import { default as template } from './register.html?raw';
import './register.scss';

@Component({
    tagName: 'div',
    template: template,
    selector: 'f-register',
})
export class FRegister extends BaseComponent {
    form!: HTMLFormElement;

    doLogin() {
        Broadcast.i.emit('changestate', ChatState.LOGIN);
    }

    doRegister() {
        if (Validator.validateForm(this.form)) {
            const formData = new FormData(this.form);
            const payload = {
                first_name: formData.get('first_name'),
                second_name: formData.get('second_name'),
                login: formData.get('login'),
                email: formData.get('email'),
                password: formData.get('password'),
                phone: formData.get('phone')
            };

            console.log('New sigh up data:');
            console.log(payload);
    
            NetworkService.i.signup(payload).then( (result) => {
                console.log(result);
                Broadcast.i.emit('changestate', ChatState.LOGIN);
            })
            .catch((error) => {
                console.log(`Error: ${error}`);
            });
        }
    }

    doValidate(event: Event) {
        Validator.validateEvent(event);
    }

    constructor() {
        super();
        this.eventBus.emit(EVENTS.INIT);
        this.form = document.querySelector('#regForm') as HTMLFormElement;
    }
}
