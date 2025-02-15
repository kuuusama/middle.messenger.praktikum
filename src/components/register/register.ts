import { BaseComponent, EVENTS } from "../../framework/basecomponent";
import { Broadcast } from "../../framework/broadcast";
import { Component } from "../../framework/decorators";
import { Inject } from "../../framework/injection";
import { NetworkService } from "../../framework/network";
import { Store } from "../../framework/store";
import Validator from "../../framework/validator";
import IUser from "../../shared/models/user";
import { ChatState } from "../main/main";
import { default as template } from "./register.html?raw";
import "./register.scss";

@Component({
    tagName: "div",
    template: template,
    selector: "f-register",
})
export class FRegister extends BaseComponent {
    @Inject(Broadcast.name) private broadcast!: Broadcast;
    @Inject(NetworkService.name) private network!: NetworkService;
    @Inject(Store.name) private store!: Store;

    form!: HTMLFormElement;

    doLogin() {
       this.broadcast.emit("changestate", ChatState.LOGIN);
    }

    doRegister(event: Event): boolean {
        event.preventDefault();
        if (Validator.validateForm(this.form)) {
            const formData = new FormData(this.form);
            const payload: IUser = {
                avatar: '',
                first_name: formData.get("first_name")?.toString() || '',
                second_name: formData.get("second_name")?.toString() || '',
                login: formData.get("login")?.toString() || '',
                email: formData.get("email")?.toString() || '',
                password: formData.get("password")?.toString() || '',
                phone: formData.get("phone")?.toString() || '',
                display_name: formData.get("display_name")?.toString() || '',
            };

            this.network
                .signup(payload)
                .then((result) => {
                    payload.id = (result as { id: number }).id;
                    this.store.setData('user', payload)
                    this.broadcast.emit("changestate", ChatState.CHAT);
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
        setTimeout( () => {
            this.form = document.querySelector("#regForm") as HTMLFormElement;
        }, 0);        
    }
}
