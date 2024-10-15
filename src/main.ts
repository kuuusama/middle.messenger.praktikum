import './main.scss';

declare global {
    interface Window { app: any; }
}

enum ChatState {
    LOGIN = 0,
    REGISTER = 1,
    CHAT = 2,
    PROFILE = 3,
}

window.app = {
    hideAllStates: () => {
        const states = document.getElementsByClassName('state');
        Array.from(states).forEach((state) => {
            state.classList.remove('visible');
        });        
    },

    changeState: (state: ChatState) => {
        console.log(`Target state: ${state}`);
        window.app.hideAllStates();
        const states = ['stateLogin', 'stateRegister', 'stateChat', 'stateProfile'];
        const div = document.getElementById(states[state]);
        console.log(`target div: `);
        console.log(div);
        div?.classList.add('visible');        
    }
}

window.app.changeState(ChatState.LOGIN);
