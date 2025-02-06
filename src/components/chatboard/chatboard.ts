import { ChatController } from "../../controllers/chat-controller";
import { UserController } from "../../controllers/user-controller";
import { BaseComponent, EVENTS } from "../../framework/basecomponent";
import { Broadcast } from "../../framework/broadcast";
import { Component } from "../../framework/decorators";
import { Inject } from "../../framework/injection";
import { Store } from "../../framework/store";
import { WebSocketShell } from "../../framework/websocketshell";
import IChat from "../../shared/models/chat";
import { Message } from "../../shared/models/message";
import IUser from "../../shared/models/user";
import { ChatState } from "../main/main";
import { default as template } from "./chatboard.html?raw";
import "./chatboard.scss";

interface IConversationDay {
    date: string;
    messages: Array<Message>;
}

const groupBy = <T, K extends string | number | symbol>(arr: T[], key: (i: T) => K) =>
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
    selector: "f-chatboard",
})
export class FChatboard extends BaseComponent {
   @Inject('Broadcast') private broadcast!: Broadcast;
   @Inject('ChatController') private chatController!: ChatController;
   @Inject('UserController') private userController!: UserController;
   @Inject('Store') private store!: Store;

    chats: Array<IChat> = [];

    activeContact: IChat | null = null;
    currentConversation: Array<IConversationDay> = [];
    currentHistory: Array<Message> = [];

    displayAttachMenu: boolean = false;
    displayUserMenu: boolean = false;

    displayUserDialog: boolean = false;
    displayChatDialog: boolean = false;
    displayChatCreateDialog: boolean = false;
    addUserMode: boolean = false;

    currentChatUsers: IUser[] = [];
    currentChatCandidats: IUser[] = [];
    private ws: WebSocketShell | null = null;

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

    selectContact(contactId: number[]) {
        this.chats.forEach((cnt) => {
            cnt.selected = false;
        });

        const chat = this.chats.find((cnt) => cnt.id === contactId[0])!;
        this.activeContact = chat;
        chat.selected = true;
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

    searchUsers(event: FocusEvent) {
        const value = (event?.target as HTMLInputElement)?.value;
        if (value) {
            this.chatController.searchUsers(value).then( (result) => {
                this.proxy.currentChatCandidats = result;
            })
        }
    }

    deleteUser() {
        const chatId = this.store.getData('currentChatId');
        this.chatController.getChatUsers(chatId).then(users => {
            this.currentChatUsers = users;

            this.proxy.displayUserMenu = false;
            this.proxy.displayUserDialog = true;
            this.proxy.addUserMode = false;

        });
    }

    deleteChat() {
        this.proxy.displayUserMenu = false;
        this.proxy.displayChatDialog = true;
    }

    doAddUser() {
        const form = document.querySelector("#cndForm") as HTMLFormElement;
        const formData = new FormData(form);
        const ids = formData.getAll('utdIds').map(id => +id);
        const chatId = this.store.getData('currentChatId');
        this.chatController.addUsersToChat(chatId, ids).then( () => {
            this.displayUserDialog = false;
            this.proxy.addUserMode = false;
            this.chatController.getChats();
        });    
    }

    closeUserDialog() {
        this.proxy.displayUserDialog = false;
    }

    doDeleteUser() {
        const form = document.querySelector("#utdForm") as HTMLFormElement;
        const formData = new FormData(form);
        const ids = formData.getAll('utdIds').map(id => +id);
        const chatId = this.store.getData('currentChatId');
        this.chatController.deleteUsersFromChat(chatId, ids).then( () => {
            this.displayUserDialog = false;
            this.proxy.addUserMode = false;
        });        
    }

    doDeleteChat() {
        const chatId = this.store.getData('currentChatId');
        this.chatController.deleteChat(chatId);
        this.proxy.displayChatDialog = false;
    }

    doNotDeleteChat() {
        this.proxy.displayChatDialog = false;
    }

    toggleUserProfile() {
      this.broadcast.emit("changestate", ChatState.PROFILE);
    }

    sendPhrase(event: Event) {
        event.preventDefault();
        const input = document.getElementById("phraseInput") as HTMLInputElement;
        if (input) {
            const value = input.value;
            if (value.length && this.ws) {
                this.ws.send(value);
                input.value = '';
            }
        }
    }

    createChat() {
        this.proxy.displayChatCreateDialog = true;
    }

    cancelCreateChat() {
        this.proxy.displayChatCreateDialog = false;
    }

    doCreateChat() {
        const form = document.querySelector("#chatCreateForm") as HTMLFormElement;
        const formData = new FormData(form);
        const chatName = formData.get('chat_name')?.toString();
        if(chatName) {
            this.chatController.createChat(chatName);
            this.proxy.displayChatCreateDialog = false;
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

    private parseMessage(message: {[key: string]: string | boolean}): void {
        if ('message' === message.type) {
            const msg = {
                ...message,
                my: message.user_id === this.store.getData('user.id'),
            };
            this.currentHistory.push(new Message(msg));
        }
    }

    private parseMessages(data: string) {
        try {
            const dataObject = JSON.parse(data);
            if (Array.isArray(dataObject)) {
                for (let i = 0; i < dataObject.length; i++) {
                    this.parseMessage(dataObject[i]);
                }
            } else {
                this.parseMessage(dataObject);
            }
            this.currentConversation = this.sortHistory(this.currentHistory);
        } catch (error) {
            console.log(error);
            console.log(data);
        }
        
        this.eventBus.emit(EVENTS.FLOW_CDU);
    }

    private initChat(userId: number, chatId: number, token: string) {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
        this.ws = new WebSocketShell();

        this.ws.on('token_invalid', () => {
            this.chatController.getChatToken(chatId).then(newToken => {
                setTimeout( () => this.initChat(userId, chatId, newToken), 500);
            });
            console.log('Token invalid');
        });

        this.ws.on('message', (data: string) => {
            this.parseMessages(data);
        });

        this.ws.on('close', (data: any) => {
            console.log(`Websocket closed: ${data}`);
        });

        this.ws.on('open', () => {
            this.ws!.getHistory();
        });
        
        console.log(`try to open socket...`);
        this.ws.open(userId, chatId, token);
    }

    constructor() {
        super();
        this.broadcast.on("select_contact", this.selectContact.bind(this));
        this.eventBus.emit(EVENTS.INIT);
        this.store.on('chats', (chats: Array<IChat>) => {
            this.chats = chats;
            this.eventBus.emit(EVENTS.FLOW_CDU);
        });

        this.store.on('currentChatId', (chatId: number) => {
            this.chatController.getChatToken(chatId).then((token: string) => {
                const userId = this.store.getData('user.id');
                this.currentHistory = [];
                this.initChat(userId, chatId, token);
                }
            );
        });
        this.userController.downloadUserData();
        this.chatController.getChats();
    }
}

