import { BaseComponent, EVENTS } from "../../framework/basecomponent";
import { Broadcast } from "../../framework/broadcast";
import { Component } from "../../framework/decorators";
import Validator from "../../framework/validator";
import User from "../../shared/models/user";
import { ChatState } from "../main/main";
import { default as template } from "./profile.html?raw";
import "./profile.scss";

@Component({
    tagName: "div",
    template: template,
    selector: "f-profile",
})
export class FProfile extends BaseComponent {
    showAvatarDialog: boolean = false;
    editMode: boolean = false;
    editPasswordMode: boolean = false;
    displayInputFileLabel: boolean = true;
    inputFileValue: string = "";
    dialogTitle: string = "Загрузите файл";
    dialogError: string = "Нужно выбрать файл";

    user: User = {
        email: "ipetrov@mail.fi",
        login: "IPetroff",
        first_name: "Иван",
        second_name: "Петров",
        display_name: "iPetroff",
        phone: "+7123456780",
        password: "QWW123456",
        avatar: "",
    };

    goBack() {
        Broadcast.i.emit("changestate", ChatState.CHAT);
    }

    doExit() {
        Broadcast.i.emit("changestate", ChatState.LOGIN);
    }

    doEdit(): void {
        this.editPasswordMode = false;
        this.proxy.editMode = true;

        console.log(`editMode: ${this.editMode}`);
    }

    doEditPassword(): void {
        this.editMode = false;
        this.proxy.editPasswordMode = true;
    }

    doSave(event: Event): boolean {
        event.preventDefault();
        const form = document.querySelector("#profileForm") as HTMLFormElement;
        const formData = new FormData(form);
        if (Validator.validateForm(form)) {
            for (const key of formData.keys()) {
                this.user[key] = formData.get(key)?.toString() || "";
            }
            console.log("New user data:");
            console.log(this.user);
            this.proxy.editMode = false;
        }
        return false;
    }

    doSavePassword(event: Event): boolean {
        event.preventDefault();
        const form = document.querySelector("#passwordForm") as HTMLFormElement;
        const formData = new FormData(form);
        if (Validator.validateForm(form)) {
            const newPassword = formData.get("password");
            console.log(`New password is: ${newPassword}`);
            //TODO: send new password hash to server
            this.proxy.editPasswordMode = false;
        }
        return false;
    }

    displayAvatarDialog(): void {
        this.proxy.showAvatarDialog = true;
    }

    fileChanged(): void {
        const inputFile = document.getElementById("inputFile");
        if (inputFile instanceof HTMLInputElement) {
            const filename = inputFile.value.split(/(\\|\/)/).pop();

            if (filename) {
                this.displayInputFileLabel = false;
                this.inputFileValue = filename;
                this.dialogTitle = "Файл загружен";
                this.proxy.dialogError = "";
            } else {
                this.displayInputFileLabel = true;
                this.inputFileValue = "";
                this.proxy.dialogTitle = "Загрузите файл";
            }
        }
    }

    doAvatarChange(): void {
        if (this.inputFileValue) {
            const rnd = Math.random();
            if (rnd < 0.5) {
                this.dialogError = "Нужно выбрать файл";
                this.dialogTitle = "Ошибка, попробуйте ещё раз";
                this.inputFileValue = "";
                this.proxy.displayInputFileLabel = true;
            } else {
                this.displayInputFileLabel = true;
                this.inputFileValue = "";
                this.dialogTitle = "Загрузите файл";
                this.proxy.showAvatarDialog = false;
            }
        } else {
            this.dialogError = "Нужно выбрать файл";
        }
    }

    doValidate(event: Event) {
        Validator.validateEvent(event);
    }

    listeners = [
        { elementId: "backButton", eventName: "click", listener: this.goBack },
        { elementId: "displayAvatarDialogButton", eventName: "click", listener: this.displayAvatarDialog },
        { elementId: "inputFile", eventName: "input", listener: this.fileChanged },
        { elementId: "profileForm", eventName: "submit", listener: this.doSave },
        { elementId: "passwordForm", eventName: "submit", listener: this.doSavePassword },
    ];

    constructor() {
        super();
        this.eventBus.emit(EVENTS.INIT);
    }
}
