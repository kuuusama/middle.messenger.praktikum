import { BaseComponent, EVENTS } from "../../framework/basecomponent";
import { Broadcast } from "../../framework/broadcast";
import { Component } from "../../framework/decorators";
import { Inject } from "../../framework/injection";
import { NetworkService } from "../../framework/network";
import { Store } from "../../framework/store";
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
   @Inject(Broadcast.name) private broadcast!: Broadcast;
   @Inject(NetworkService.name) private network!: NetworkService;
   @Inject(Store.name) private store!: Store;
    
    form!: HTMLFormElement;
    error: string | null = null;

    doLogin(event: Event): boolean {
        event.preventDefault();
        this.form = document.getElementById("loginForm") as HTMLFormElement;
        if (Validator.validateForm(this.form)) {
            this.proxy.error = null;
            const formData = new FormData(this.form);
            const payload = {
                login: formData.get("login")?.toString() || '',
                password: formData.get("password")?.toString() || '',
            };
            this.network
                .signin(payload)
                .then((result) => {
                    if('OK' === result) {
                        this.store.setData('userLoggedIn', true);
                        this.broadcast.emit("changestate", ChatState.CHAT);
                    }
                })
                .catch((error) => {
                    this.proxy.error = error.reason;
                    if (error.reason === "User already in system") {
                        this.broadcast.emit("changestate", ChatState.CHAT);
                    }
                });
        }
        return false;
    }

    doRegister() {
       this.broadcast.emit("changestate", ChatState.REGISTER);
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
        setTimeout(() => {
            this.form = document.getElementById("loginForm") as HTMLFormElement;
        }, 0);
        
    }
}
