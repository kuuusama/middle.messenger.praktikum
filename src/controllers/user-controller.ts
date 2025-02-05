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
        }, 
        (error) => {
            console.log(`Got error: ${error}`);
        }
    );
    }

    public saveUserData(user: IUser): void {
        this.network.saveUserInfo(user).then( (result: string) => {
            this.store.setData('user', JSON.parse(result));
        })
    }

    public saveUserPassword(passwords: {oldPassword: string, newPassword: string} ): void {
        this.network.saveUserPassword(passwords).then( (result: string) => {
            this.store.setData('user', JSON.parse(result));
        })
    }

    public saveAvatar(data: FormData): Promise<string> {
        return this.network.saveUserAvatar(data).then( (result) => {
            return new Promise((resolve, reject) => {
                this.store.setData('user', JSON.parse(result));
                resolve('ok');
                reject('Что-то пошло не так');
            },
        )
        })
    }

    public searchUsers(login: string): Promise<Array<IUser>> {
        return this.network.searchUsers(login).then( (result) => {
            return new Promise<Array<IUser>>( (resolve) => {
                resolve(JSON.parse(result));
            });
        });
    }

    public isLoggedIn(): boolean {
        return this.store.getData('userLoggedIn');
    }

    private constructor() {}
}