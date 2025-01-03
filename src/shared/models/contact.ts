import { Message } from "./message";

export class Contact {
    id: number;
    avatar: string;
    name: string;
    lastMessage: string;
    lastMessageTime: string;
    unreadMessages: number;
    selected: boolean;
    lastMessageYours: boolean;
    lastMessageDate: Date = new Date();
    history: Array<Message> = []

    private get dateHM() {
        return `${this.lastMessageDate.getHours()}:${this.lastMessageDate.getMinutes()}`;
    }

    constructor(data: {
        id: number;
        avatar: string;
        name: string;
        lastMessage: string;
        unreadMessages: number;
        lastMessageDate: string;
        selected?: boolean;
        lastMessageYours?: boolean;
        history?: Array<Message>;
    }) {
        this.id = data.id;
        this.avatar = data.avatar;
        this.name = data.name;
        this.lastMessage = data.lastMessage;
        this.unreadMessages = data.unreadMessages
        this.lastMessageDate = new Date(data.lastMessageDate);
        this.lastMessageTime = this.dateHM; //Handlebars won't call this due to security restrictions
        this.selected = data.selected ?? false;
        this.lastMessageYours = data.lastMessageYours ?? false;
        this.history = data.history ?? [];
    }
}