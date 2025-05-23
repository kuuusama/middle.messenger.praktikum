import { BaseComponent, EVENTS } from "../../framework/basecomponent";
import { Component } from "../../framework/decorators";
import { Broadcast } from "../../framework/broadcast";
import { default as template } from "./main.html?raw";
import "./main.scss";
import { Router } from "../../framework/router";
import { FChatboard } from "../chatboard/chatboard";
import { FLogin } from "../login/login";
import { FProfile } from "../profile/profile";
import { FRegister } from "../register/register";
import { FNotFound } from "../404/404";
import { FServerError } from "../500/500";
import { Inject } from "../../framework/injection";
import { Fahrenheit } from "../451/451";

export enum ChatState {
    LOGIN = '/',
    REGISTER = '/sign-up',
    CHAT = '/messenger',
    PROFILE = '/settings',
    NOT_FOUND = '/404',
    SERVER_ERROR = '/500',
}

@Component({
    tagName: "div",
    template: template,
    selector: "f-main",
})
export class FMain extends BaseComponent {
   @Inject(Router.name) private router!: Router;
   @Inject(Broadcast.name) private broadcast!: Broadcast;
    
    state: ChatState = ChatState.LOGIN;

    private initRouter(): void {
        this.router.use('/404', FNotFound);
        this.router.use('/451', Fahrenheit);
        this.router.use('/500', FServerError);
        this.router.use('/', FLogin);
        this.router.use('/sign-up', FRegister);
        this.router.use('/settings', FProfile);
        this.router.use('/messenger', FChatboard);
        this.router.start();

        const urlParams = new URLSearchParams(window.location.search);
        const page = urlParams.get('page');
        if(page) {
            let target = '';
            switch(page) {
                case '404':
                    target = '/404';
                    break;

                case '451':
                    target = '/451';
                    break;

                case '500':
                    target = '/500';
                    break;

                case 'sign-up':
                    target = '/sign-up';
                    break;

                case 'settings':
                    target = '/settings';
                    break;

                case 'messenger':
                    target = '/messenger';
                    break;
            }
            this.router.go(target);
        }
    }

    constructor() {
        console.log('init MAIN');
        super();

        this.broadcast.on("changestate", (state: ChatState) => {
            this.router.go(state);
        });

        this.eventBus.emit(EVENTS.INIT);
        setTimeout( () => this.initRouter(), 0 );
    }
}
