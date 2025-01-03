import { BaseComponent, EVENTS } from "../../framework/basecomponent";
import { Broadcast } from "../../framework/broadcast";
import { Component } from "../../framework/decorators";
import { NetworkService } from "../../framework/network";
import Validator from "../../framework/validator";
import { FInput } from "../../shared/components/input/input";
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

    doLogin() {
        if (Validator.validateForm(this.form)) {
            Broadcast.i.emit("changestate", ChatState.CHAT);
            const formData = new FormData(this.form);
            const payload = {
                login: formData.get("login"),
                password: formData.get("password"),
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
    }

    doRegister() {
        Broadcast.i.emit("changestate", ChatState.REGISTER);
    }

    doValidate(event: Event) {
        Validator.validateEvent(event);
    }

    constructor() {
        super();
        this.eventBus.emit(EVENTS.INIT);
        this.form = document.querySelector("#loginForm") as HTMLFormElement;
    }
}
