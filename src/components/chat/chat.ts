import { BaseComponent, EVENTS } from "../../framework/basecomponent";
import { Broadcast } from "../../framework/broadcast";
import { Component } from "../../framework/decorators";
import { Contact } from "../../shared/models/contact";
import { Message } from "../../shared/models/message";
import { ChatState } from "../main/main";
import { default as template } from "./chat.html?raw";
import "./chat.scss";

interface IConversationDay {
    date: string;
    messages: Array<Message>;
}

const groupBy = <T, K extends keyof any>(arr: T[], key: (i: T) => K) =>
    arr.reduce(
        (groups, item) => {
            (groups[key(item)] ||= []).push(item);
            return groups;
        },
        {} as Record<K, T[]>,
    );

@Component({
    tagName: "div",
    template: template,
    selector: "f-chat",
})
export class FChat extends BaseComponent {
    contacts: Array<Contact> = [
        new Contact({
            id: 1,
            avatar: "",
            name: "Жора",
            lastMessage: `Привет! Смотри, тут всплыл интересный кусок лунной космической истории — НАСА в какой-то момент
                          попросила Хассельблад адаптировать модель SWC для полетов на Луну. Сейчас мы все знаем что
                          астронавты летали с моделью 500 EL — и к слову говоря, все тушки этих камер все еще находятся на
                          поверхности Луны, так как астронавты с собой забрали только кассеты с пленкой.`,
            unreadMessages: 4,
            lastMessageDate: new Date().toUTCString(),
            lastMessageYours: true,
        }),
        new Contact({
            id: 2,
            avatar: "",
            name: "Петя",
            lastMessage: `Привет! Смотри, тут всплыл интересный кусок лунной космической истории — НАСА в какой-то момент
                          попросила Хассельблад адаптировать модель SWC для полетов на Луну. Сейчас мы все знаем что
                          астронавты летали с моделью 500 EL — и к слову говоря, все тушки этих камер все еще находятся на
                          поверхности Луны, так как астронавты с собой забрали только кассеты с пленкой.`,
            unreadMessages: 4,
            lastMessageDate: new Date().toUTCString(),
        }),
        new Contact({
            id: 3,
            avatar: "",
            name: "Вася",
            lastMessage: `Привет! Смотри, тут всплыл интересный кусок лунной космической истории — НАСА в какой-то момент
                          попросила Хассельблад адаптировать модель SWC для полетов на Луну. Сейчас мы все знаем что
                          астронавты летали с моделью 500 EL — и к слову говоря, все тушки этих камер все еще находятся на
                          поверхности Луны, так как астронавты с собой забрали только кассеты с пленкой.`,
            unreadMessages: 4,
            lastMessageDate: new Date().toUTCString(),
        }),
        new Contact({
            id: 4,
            avatar: "",
            name: "Вадим",
            lastMessage: `Привет! Смотри, тут всплыл интересный кусок лунной космической истории — НАСА в какой-то момент
                          попросила Хассельблад адаптировать модель SWC для полетов на Луну. Сейчас мы все знаем что
                          астронавты летали с моделью 500 EL — и к слову говоря, все тушки этих камер все еще находятся на
                          поверхности Луны, так как астронавты с собой забрали только кассеты с пленкой.`,
            unreadMessages: 4,
            lastMessageDate: new Date().toUTCString(),
            selected: true,
            history: [
                new Message({
                    text: `Привет! Смотри, тут всплыл интересный кусок лунной космической истории — НАСА в какой-то момент
                                попросила Хассельблад адаптировать модель SWC для полетов на Луну. Сейчас мы все знаем что
                                астронавты летали с моделью 500 EL — и к слову говоря, все тушки этих камер все еще находятся на
                                поверхности Луны, так как астронавты с собой забрали только кассеты с пленкой.`,
                    date: new Date().toUTCString(),
                    read: true,
                    my: false,
                }),
                new Message({
                    text: `Круто!`,
                    date: new Date().toUTCString(),
                    read: false,
                    my: true,
                }),
                new Message({
                    text: `Привет! Смотри, тут всплыл интересный кусок лунной космической истории — НАСА в какой-то момент
                                попросила Хассельблад адаптировать модель SWC для полетов на Луну. Сейчас мы все знаем что
                                астронавты летали с моделью 500 EL — и к слову говоря, все тушки этих камер все еще находятся на
                                поверхности Луны, так как астронавты с собой забрали только кассеты с пленкой.`,
                    date: new Date("2024-10-19 21:10").toUTCString(),
                    read: true,
                    my: false,
                }),
                new Message({
                    text: `Круто!`,
                    date: new Date("2024-10-19 22:30").toUTCString(),
                    read: false,
                    my: true,
                }),
            ],
        }),
    ];

    activeContact: Contact | null = null;
    currentConversation: Array<IConversationDay> = [];

    displayAttachMenu: boolean = false;
    displayUserMenu: boolean = false;

    displayUserDialog: boolean = false;
    displayChatDialog: boolean = false;
    addUserMode: boolean = false;

    private sortHistory(messages: Array<Message>): Array<IConversationDay> {
        const result: Array<IConversationDay> = [];
        const msgs = messages.sort((b, a) => {
            return b.date.getTime() - a.date.getTime();
        });

        const rez = groupBy(msgs, (message) => message.dateDay);

        Object.keys(rez).forEach((key) => {
            result.push({
                date: key,
                messages: rez[key],
            });
        });

        return result;
    }

    selectContact(contactId: number) {
        this.contacts.forEach((cnt) => {
            cnt.selected = false;
        });

        const contact = this.contacts.find((cnt) => cnt.id == contactId)!;
        this.activeContact = contact;
        contact.selected = true;

        this.currentConversation = this.sortHistory(contact.history);

        this.eventBus.emit(EVENTS.FLOW_CDU);
    }

    toggleAttachMenu(): void {
        this.proxy.displayAttachMenu = !this.proxy.displayAttachMenu;
    }

    toggleUserMenu(): void {
        this.proxy.displayUserMenu = !this.proxy.displayUserMenu;
    }

    addUser() {
        this.proxy.displayUserMenu = false;
        this.proxy.displayUserDialog = true;
        this.proxy.addUserMode = true;
    }

    deleteUser() {
        this.proxy.displayUserMenu = false;
        this.proxy.displayUserDialog = true;
        this.proxy.addUserMode = false;
    }

    deleteChat() {
        this.proxy.displayUserMenu = false;
        this.proxy.displayChatDialog = true;
    }

    doAddUser() {
        this.proxy.displayUserDialog = false;
        this.proxy.addUserMode = false;
    }

    doDeleteUser() {
        this.proxy.displayUserDialog = false;
        this.proxy.addUserMode = false;
    }

    doDeleteChat() {
        this.proxy.displayChatDialog = false;
    }

    doNotDeleteChat() {
        this.proxy.displayChatDialog = false;
    }

    toggleUserProfile() {
        Broadcast.i.emit("changestate", ChatState.PROFILE);
    }

    sendPhrase(event: Event) {
        event.preventDefault();
        const input = document.getElementById("phraseInput") as HTMLInputElement;
        if (input) {
            const value = input.value;
            if (value.length) {
                //TODO: send phrase to server
                console.log(value);
                input.value = '';
            }
        }
    }

    listeners = [
        { elementId: "attachMenuButton", eventName: "click", listener: this.toggleAttachMenu },
        { elementId: "attachFileButton", eventName: "click", listener: this.toggleAttachMenu },
        { elementId: "attachImageButton", eventName: "click", listener: this.toggleAttachMenu },
        { elementId: "attachLocationButton", eventName: "click", listener: this.toggleAttachMenu },
        { elementId: "addUserButton", eventName: "click", listener: this.addUser },
        { elementId: "deleteUserButton", eventName: "click", listener: this.deleteUser },
        { elementId: "deleteChatButton", eventName: "click", listener: this.deleteChat },
        { elementId: "userMenuButton", eventName: "click", listener: this.toggleUserMenu },
        { elementId: "profileToggleLink", eventName: "click", listener: this.toggleUserProfile },
        { elementId: "phraseForm", eventName: "submit", listener: this.sendPhrase },
    ];

    constructor() {
        super();
        Broadcast.i.on("select_contact", this.selectContact.bind(this));
        this.eventBus.emit(EVENTS.INIT);
    }
}
