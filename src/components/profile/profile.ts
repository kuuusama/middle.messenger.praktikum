import { UserController } from "../../controllers/user-controller";
import { BaseComponent, EVENTS } from "../../framework/basecomponent";
import { Broadcast } from "../../framework/broadcast";
import { Component } from "../../framework/decorators";
import { Inject } from "../../framework/injection";
import { Store } from "../../framework/store";
import Validator from "../../framework/validator";
import IUser from "../../shared/models/user";
import { ChatState } from "../main/main";
import { default as template } from "./profile.html?raw";
import "./profile.scss";

@Component({
    tagName: "div",
    template: template,
    selector: "f-profile",
})
export class FProfile extends BaseComponent {
   @Inject(Broadcast.name) private broadcast!: Broadcast;
   @Inject(Store.name) private store!: Store;
   @Inject(UserController.name) private userController!: UserController;
    
    showAvatarDialog: boolean = false;
    editMode: boolean = false;
    editPasswordMode: boolean = false;
    displayInputFileLabel: boolean = true;
    inputFileName: string = "";
    file: File | null = null;
    dialogTitle: string = "Загрузите файл";
    dialogError: string = "Нужно выбрать файл";

    user!: IUser;

    goBack() {
       this.broadcast.emit("changestate", ChatState.CHAT);
    }

    doExit() {
        this.userController.logout();
    }

    doEdit(): void {
        this.editPasswordMode = false;
        this.proxy.editMode = true;
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
            this.userController.saveUserData(this.user);
            this.proxy.editMode = false;
        }
        return false;
    }

    doSavePassword(event: Event): boolean {
        event.preventDefault();
        const form = document.querySelector("#passwordForm") as HTMLFormElement;
        const formData = new FormData(form);
        if (Validator.validateForm(form)) {
            const newPassword = formData.get("password")?.toString();
            const oldPassword = formData.get("oldPassword")?.toString();
            this.userController.saveUserPassword(
                {oldPassword: oldPassword!, newPassword: newPassword!}
            );

            this.proxy.editPasswordMode = false;
        }
        return false;
    }

    displayAvatarDialog(): void {
        this.proxy.showAvatarDialog = true;
    }

    fileChanged(): void {
        const inputFile = document.getElementById("inputFile");
        if (inputFile instanceof HTMLInputElement && inputFile.files?.length) {
            const filename = inputFile.value.split(/(\\|\/)/).pop();

            if (filename) {
                this.displayInputFileLabel = false;
                this.inputFileName = filename;
                this.dialogTitle = "Файл загружен";
                this.file = inputFile.files[0];
                this.proxy.dialogError = "";
            } else {
                this.displayInputFileLabel = true;
                this.inputFileName = "";
                this.proxy.dialogTitle = "Загрузите файл";
            }
        }
    }

    doAvatarChange(): void {
        if (this.inputFileName) {
            const formData = new FormData();
            formData.append('avatar', this.file as Blob, this.inputFileName);
            this.userController.saveAvatar(formData)
                .then(() => {
                    this.displayInputFileLabel = true;
                    this.inputFileName = "";
                    this.dialogTitle = "Загрузите файл";
                    this.proxy.showAvatarDialog = false;
                })
                .catch((error) => {
                    console.log(error);
                    this.dialogError = error.reason;
                    this.dialogTitle = "Ошибка, попробуйте ещё раз";
                    this.inputFileName = "";
                    this.proxy.displayInputFileLabel = true;
                });
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

    show(): void {
        this.user = this.store.getData('user');
        this.style.display = "contents";
        this.userController.downloadUserData();
        this.eventBus.emit(EVENTS.FLOW_CDU);
    }

    constructor() {
        super();
        this.store.on('user', (userInfo: IUser) => {
            this.user = userInfo;
            console.log(this.user);
            this.eventBus.emit(EVENTS.FLOW_CDU);
        });
        this.eventBus.emit(EVENTS.INIT);
    }
}
