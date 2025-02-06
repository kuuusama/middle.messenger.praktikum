import IUser from "../shared/models/user";
import { HTTP } from "./http";
import { Inject, Injectable } from "./injection";

const httpOptions = {
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Headers': 'Content-Type',
    },
};

export
@Injectable()
class NetworkService {
    @Inject(HTTP.name) private http!: HTTP;
    
    private baseUrl: string = "https://ya-praktikum.tech/api/v2";
    
/* Authorization */
    signin(payload: { login: string; password: string }) {
        const options = {...httpOptions, data: payload };
        return this.http.post(`${this.baseUrl}/auth/signin`, options);
    }

    signup(payload: IUser) {
        const options = {...httpOptions, data: payload };
        return this.http.post(`${this.baseUrl}/auth/signup`, options);
    }

    logout() {
        const options = {...httpOptions };
        return this.http.post(`${this.baseUrl}/auth/logout`, options);
    }

    getUserInfo(): Promise<string> {
        const options = {...httpOptions, timeout: 1000 };
        return this.http.get(`${this.baseUrl}/auth/user`, options) as Promise<string>;
    }

/* Users */

    saveUserInfo(user: IUser): Promise<string> {
        const options = {...httpOptions, timeout: 1000, data: user };
        return this.http.put(`${this.baseUrl}/user/profile`, options) as Promise<string>;
    }

    saveUserAvatar(data: FormData) {
        const options = {
            headers: {
                'Accept': 'application/json',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
            timeout: 1000,
            data: data
        };
        
        return this.http.put(`${this.baseUrl}/user/profile/avatar`, options) as Promise<string>;
    }

    saveUserPassword(passwords: { oldPassword: string; newPassword: string; }) {
        const options = {...httpOptions, timeout: 1000, data: passwords };
        return this.http.put(`${this.baseUrl}/user/password`, options) as Promise<string>;        
    }

    searchUsers(login: string): Promise<string> {
        const options = {...httpOptions, timeout: 1000, data: {login: login} };
        return this.http.post(`${this.baseUrl}/user/search`, options) as Promise<string>;
    }

/* Chat */
    public getChats(offset: number | null, limit: number | null, title: string): Promise<string> {
        const data = {
            ...(offset && { offset: offset }),
            ...(limit && { limit: limit }),
            ...(title && { title: title }),
        };
        const options = {...httpOptions, timeout: 1000, data: data };
        return this.http.get(`${this.baseUrl}/chats`, options) as Promise<string>;
    }

    public createChat(title: string): Promise<string> {
        const options = {...httpOptions, timeout: 1000, data: {title: title} };
        return this.http.post(`${this.baseUrl}/chats`, options) as Promise<string>;
    }

    public deleteChat(id: number): Promise<string> {
        const options = {...httpOptions, timeout: 1000, data: { chatId: id } };
        return this.http.delete(`${this.baseUrl}/chats`, options) as Promise<string>;
    }

    public getChatToken(id: number): Promise<string> {
        const options = {...httpOptions, timeout: 1000, data: {} };
        return this.http.post(`${this.baseUrl}/chats/token/${id}`, options) as Promise<string>;
    }

    public getChatFiles(chatId: number): Promise<string> {
        const options = {...httpOptions, timeout: 1000, data: {} };
        return this.http.post(`${this.baseUrl}/chats/${chatId}/files`, options) as Promise<string>;
    }

    public addUsersToChat(request: {chatId: number, users: Array<number>}): Promise<string> {
        const options = {...httpOptions, timeout: 1000, data: request };
        return this.http.put(`${this.baseUrl}/chats/users`, options) as Promise<string>;
    }

    public deleteUsersFromChat(request: {chatId: number, users: Array<number>}): Promise<string> {
        const options = {...httpOptions, timeout: 1000, data: request };
        return this.http.delete(`${this.baseUrl}/chats/users`, options) as Promise<string>;
    }

    public getChatUsers(payload: any): Promise<string> {
        const options = {...httpOptions, timeout: 1000, data: payload };
        return this.http.get(`${this.baseUrl}/chats/${payload.id}/users`, options) as Promise<string>;
    }

    private constructor() {}
}
