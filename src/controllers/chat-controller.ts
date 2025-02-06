import { Inject, Injectable } from "../framework/injection";
import { NetworkService } from "../framework/network";
import { Store } from "../framework/store";
import IChat from "../shared/models/chat";
import IChatMessage from "../shared/models/chat-message";
import IUser from "../shared/models/user";

export
@Injectable()
class ChatController {
    @Inject(Store.name) private store!: Store;
    @Inject(NetworkService.name) private network!: NetworkService;

    public getChats() {
        this.network.getChats(null, null, '').then( (result) => {
            const chats: Array<IChat> = [];
            const tmp = JSON.parse(result);
            Object.keys(tmp).forEach((key) => {
                chats.push(tmp[key]);
            });
            this.store.setData('chats', chats);
        }).catch(() => {
            this.store.setData('chats',[
                {
                    id: 0,
                    title: 'Fake chat',
                    avatar: '',
                    unread_count: 1,
                    last_message: {
                        user: 0,
                        time: '',
                        content: 'string'
                    }
                }
            ])
        }

        );
    }

    public createChat(title: string): void {
        this.network.createChat(title).then( () => {
            this.getChats();
        })
    }

    public deleteChat(id: number): void {
        this.network.deleteChat(id).then( () => {
            this.getChats();
        });
    }

    public getChatToken(chatId: number): Promise<string> {
        return this.network.getChatToken(chatId).then( (result: string) => {
            return new Promise<string>( (resolve) => {
                resolve(JSON.parse(result).token);
            })
        } );
    }

    public getChatFiles(chatId: number): Promise<Array<IChatMessage>> {
        return this.network.getChatFiles(chatId).then( (result: string) => {
            return new Promise<Array<IChatMessage>>( (resolve) => {
                resolve(JSON.parse(result));
            });
        });
    }

    public addUsersToChat(chatId: number, userIds: Array<number>) {
        const request = {
            chatId: chatId,
            users: userIds
        };
        return this.network.addUsersToChat(request).then( (result: string) => {
            console.log(result);
        });
    }

    public deleteUsersFromChat(chatId: number, userIds: Array<number>) {
        const request = {
            chatId: chatId,
            users: userIds
        };
        return this.network.deleteUsersFromChat(request).then( (result: string) => {
            console.log(result);            
        });
    }

    public getChatUsers(chatId: number, params?: {offset?: number, limit?: number, name?: string, email?: string})
    :Promise<IUser[]> {
        const payload = {
            id: chatId,
            ...(params ? params : {})
        };
        return this.network.getChatUsers(payload).then( (result: string) => {
            return new Promise<Array<IUser>>( (resolve) => {
                const users = JSON.parse(result);
                users.forEach(
                    (user: IUser) => {user.notAdmin = user.role !== 'admin'}
                );
                this.store.setData('currentChatUsers', users);
                resolve(users);
            });
        }).catch(() => {
            return new Promise<Array<IUser>>((resolve) => {
                resolve([
                    {
                        id: 0,
                        email: 'string',
                        login: 'login',
                        first_name: 'first name',
                        second_name: 'second name',
                        display_name: 'DisplayName',
                        phone: '123456',
                        avatar: ''
                    }
                ])
            })
        });   
    }

    public searchUsers(login: string):Promise<Array<IUser>> {
        return this.network.searchUsers(login).then( (result: string) => {
            return new Promise<Array<IUser>>( (resolve) => {
                const users = JSON.parse(result);
                users.forEach(
                    (user: IUser) => {user.notAdmin = user.role !== 'admin'}
                );
                resolve(users);
            });
        }).catch(() => {
            return new Promise<Array<IUser>>((resolve) => {
                resolve([
                    {
                        id: 0,
                        email: 'string',
                        login: 'login',
                        first_name: 'first name',
                        second_name: 'second name',
                        display_name: 'DisplayName',
                        phone: '123456',
                        avatar: ''
                    }
                ])
            })
        });   
    }
}

