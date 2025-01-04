import { BaseComponent, EVENTS } from "../../framework/basecomponent";
import { Broadcast } from "../../framework/broadcast";
import { Component } from "../../framework/decorators";
import { NetworkService } from "../../framework/network";
import Validator from "../../framework/validator";
import { ChatState } from "../main/main";
import { default as template } from "./login.html?raw";
import "./login.scss";

@Component({
    tagName: "div",
    template: template,
    selector: "f-login",
})
export class FLogin extends BaseComponent {
    form!: HTMLFormElement;

    doLogin(event: Event): boolean {
        event.preventDefault();
        if (Validator.validateForm(this.form)) {
            Broadcast.i.emit("changestate", ChatState.CHAT);
            const formData = new FormData(this.form);
            const payload = {
                login: formData.get("login")?.toString() || '',
                password: formData.get("password")?.toString() || '',
            };
            NetworkService.i
                .signin(payload)
                .then((result) => {
                    console.log(result);
                    Broadcast.i.emit("changestate", ChatState.CHAT);
                })
                .catch((error) => {
                    console.log(`Error: ${error}`);
                });
        }
        return false;
    }

    doRegister() {
        Broadcast.i.emit("changestate", ChatState.REGISTER);
    }

    doValidate(event: Event) {
        Validator.validateEvent(event);
    }

    listeners = [
        { elementId: "loginForm", eventName: "submit", listener: this.doLogin },
    ];

    constructor() {
        super();
        this.eventBus.emit(EVENTS.INIT);
        this.form = document.querySelector("#loginForm") as HTMLFormElement;
    }
}
