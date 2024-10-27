import "./main.scss";

declare global {
    interface Window {
        app: any;
    }
}

enum ChatState {
    LOGIN = 0,
    REGISTER = 1,
    CHAT = 2,
    PROFILE = 3,
    NOT_FOUND = 4,
}

window.app = {
    hideAllStates: () => {
        const states = document.getElementsByClassName("state");
        Array.from(states).forEach((state) => {
            state.classList.remove("visible");
        });
    },

    changeState: (state: ChatState) => {
        window.app.hideAllStates();
        const states = [
            "stateLogin",
            "stateRegister",
            "stateChat",
            "stateProfile",
            "state404",
        ];
        const div = document.getElementById(states[state]);
        div?.classList.add("visible");
    },
};

window.app.changeState(ChatState.LOGIN);
