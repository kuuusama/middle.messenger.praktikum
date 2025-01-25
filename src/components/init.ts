import { UserController } from "../controllers/user-controller";
import { FNotFound } from "./404/404";
import { Fahrenheit } from "./451/451";
import { FServerError } from "./500/500";
import { FChat } from "./chat/chat";
import { FContact } from "./contact/contact";
import { FLogin } from "./login/login";
import { FMain } from "./main/main";
import { FMessage } from "./message/message";
import { FProfile } from "./profile/profile";
import { FRegister } from "./register/register";

const appComponents = {
    UserController,
    FNotFound,
    Fahrenheit,
    FServerError,
    FLogin,
    FRegister,
    FProfile,
    FMain,
    FChat,
    FMessage,
    FContact,
    init: () => {},
};

export default appComponents;
