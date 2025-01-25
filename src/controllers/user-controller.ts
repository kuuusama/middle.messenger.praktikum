import { ChatState } from "../components/main/main";
import { Broadcast } from "../framework/broadcast";
import { Inject, Injectable } from "../framework/injection";
import { NetworkService } from "../framework/network";
import { Store } from "../framework/store";
import IUser from "../shared/models/user";

export
@Injectable()
class UserController {
    @Inject('Store') private store!: Store;
    @Inject('NetworkService') private network!: NetworkService;
    @Inject('Broadcast') private broadcast!: Broadcast;

    public logout() {
        this.network.logout();
        this.store.setData('userLoggedIn', false);
        this.broadcast.emit("changestate", ChatState.LOGIN);
    }

    public downloadUserData(): void {
        this.network.getUserInfo().then( (result: string) => {
            this.store.setData('user', JSON.parse(result));
        });
    }

    public saveUserData(user: IUser): void {
        this.network.saveUserInfo(user).then( (result: string) => {
            this.store.setData('user', JSON.parse(result));
        })
    }

    public saveAvatar(data: FormData): Promise<string> {
        return this.network.saveUserAvatar(data).then( (result) => {
            return new Promise((resolve, reject) => {
                resolve(result);
                reject('Что-то пошло не так');
            },
        )
        })
    }

    public isLoggedIn(): boolean {
        return this.store.getData('userLoggedIn');
    }

    private constructor() {}
}