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
    @Inject('HTTP') private http!: HTTP;
    
    private baseUrl: string = "https://ya-praktikum.tech/api/v2";
    

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

    saveUserInfo(user: IUser): Promise<string> {
        const options = {...httpOptions, timeout: 1000, data: user };
        return this.http.put(`${this.baseUrl}/user/profile`, options) as Promise<string>;
    }

    saveUserAvatar(data: FormData) {
        const options = {...httpOptions, timeout: 1000, data: data };
        options.headers["Content-Type"] = 'multipart/form-data'
        return this.http.put(`${this.baseUrl}/user/profile/avatar`, options) as Promise<string>;
    }

    private constructor() {}
}
