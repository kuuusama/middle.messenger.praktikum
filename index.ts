import "./index.scss";
import Handlebars from "handlebars";

import frameworkComponents from "./src/framework/init";
import appComponents from "./src/components/init";

frameworkComponents.init();
appComponents.init();



declare global {
    interface Window {
        app: any;
    }
}

window.app = {
    hideAllStates: () => {
        const states = document.getElementsByClassName("state");
        Array.from(states).forEach((state) => {
            state.classList.remove("visible");
        });
    },

    // changeState: (state: ChatState) => {
    //     window.app.hideAllStates();
    //     const states = [
    //         "stateLogin",
    //         "stateRegister",
    //         "stateChat",
    //         "stateProfile",
    //         "state404",
    //         "state500",
    //     ];
    //     const div = document.getElementById(states[state]);
    //     div?.classList.add("visible");
    // },
};

// window.app.changeState(ChatState.LOGIN);

// class Obj {
//     [key: string]: any;

//     sbuttonClick(arg: any) {
//         alert('Sbutton click!');
//     };

//     sbuttonBlur() {
//         alert('Sbutton blur!');
//     }
    
//     handler(event: any): void {
//         const listener = event.detail.listener;
//         if (listener) {
//             this[listener]();
//         }
//     };

//     constructor() {}
// }

// let elem = document.getElementById('fb1');
// const objInstance = new Obj();
// elem?.addEventListener('fbutton:fb1:click', objInstance.handler.bind(objInstance));
// elem?.addEventListener('fbutton:fb1:mouseenter', objInstance.handler.bind(objInstance));
