import { BaseComponent, EVENTS } from "../../framework/basecomponent";
import { Broadcast } from "../../framework/broadcast";
import { Component } from "../../framework/decorators";
import { NetworkService } from "../../framework/network";
import Validator from "../../framework/validator";
import User from "../../shared/models/user";
import { ChatState } from "../main/main";
import { default as template } from "./register.html?raw";
import "./register.scss";

@Component({
    tagName: "div",
    template: template,
    selector: "f-register",
})
export class FRegister extends BaseComponent {
    form!: HTMLFormElement;

    doLogin() {
        Broadcast.i.emit("changestate", ChatState.LOGIN);
    }

    doRegister(event: Event): boolean {
        event.preventDefault();
        if (Validator.validateForm(this.form)) {
            const formData = new FormData(this.form);
            const payload: User = {
                avatar: '',
                first_name: formData.get("first_name")?.toString() || '',
                second_name: formData.get("second_name")?.toString() || '',
                login: formData.get("login")?.toString() || '',
                email: formData.get("email")?.toString() || '',
                password: formData.get("password")?.toString() || '',
                phone: formData.get("phone")?.toString() || '',
                display_name: formData.get("display_name")?.toString() || '',
            };

            console.log("New sigh up data:");
            console.log(payload);

            NetworkService.i
                .signup(payload)
                .then((result) => {
                    console.log(result);
                    Broadcast.i.emit("changestate", ChatState.LOGIN);
                })
                .catch((error) => {
                    console.log(`Error: ${error}`);
                });
        }
        return false;
    }

    doValidate(event: Event) {
        Validator.validateEvent(event);
    }

    listeners = [
        { elementId: "regForm", eventName: "submit", listener: this.doRegister },
    ];

    constructor() {
        super();
        this.eventBus.emit(EVENTS.INIT);
        this.form = document.querySelector("#regForm") as HTMLFormElement;
    }
}
