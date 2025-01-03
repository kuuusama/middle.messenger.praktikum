import { HTTP } from "./http";

export class NetworkService {
    private baseUrl: string = 'https://ya-praktikum.tech/api/v2'

    signin(payload: {login: string, pwd: string}) {
        const options = { data: payload };
        return HTTP.i.post(`${this.baseUrl}/signin`, options);
    }

    signup(payload: any) {
        const options = {data: payload};
        return HTTP.i.post(`${this.baseUrl}/signup`, options);
    }

    private static _instance: NetworkService;

    public static get i() {
        return this._instance || (this._instance = new this)
    }
    private constructor() {}
}