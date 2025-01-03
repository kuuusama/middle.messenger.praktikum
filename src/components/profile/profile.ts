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
        avatar: "",
    };

    goBack() {
        Broadcast.i.emit("changestate", ChatState.CHAT);
    }

    doExit() {
        Broadcast.i.emit("changestate", ChatState.LOGIN);
    }

    doEdit(): void {
        this.proxy.editMode = true;
    }

    doEditPassword(): void {
        this.editMode = false;
        this.proxy.editPasswordMode = true;
    }

    doSave(): void {
        const form = document.querySelector(this.editMode ? "#profileForm" : "#passwordForm") as HTMLFormElement;
        const formData = new FormData(form);
        if (Validator.validateForm(form)) {
            if (this.editMode) {
                for (let key of formData.keys()) {
                    this.user[key] = formData.get(key)?.toString() || "";
                }
                console.log("New user data:");
                console.log(this.user);
                this.proxy.editMode = false;
            } else {
                const newPassword = formData.get("password");
                //TODO: send new password hash to server
                this.proxy.editPasswordMode = false;
            }
        }
    }

    displayAvatarDialog(): void {
        this.proxy.showAvatarDialog = true;
    }

    fileChanged(): void {
        const inputFile = document.getElementById("inputFile");
        if (inputFile) {
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
    ];

    constructor() {
        super();
        this.eventBus.emit(EVENTS.INIT);
    }
}
