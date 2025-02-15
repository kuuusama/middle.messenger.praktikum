import { FNotFound } from "./404/404";
import { Fahrenheit } from "./451/451";
import { FServerError } from "./500/500";
import { FChatboard } from "./chatboard/chatboard";
import { FChat } from "./chat/chat";
import { FLogin } from "./login/login";
import { FMain } from "./main/main";
import { FMessage } from "./message/message";
import { FProfile } from "./profile/profile";
import { FRegister } from "./register/register";

const appComponents = {
    FNotFound,
    Fahrenheit,
    FServerError,
    FLogin,
    FRegister,
    FProfile,
    FMain,
    FChatboard,
    FMessage,
    FChat,
    init: () => {},
};

export default appComponents;
