import { BaseComponent } from "./basecomponent";

export enum ERRORS {
    TOO_SHORT = "Не меньше 3 символов",
    ILLEGAL_CHARS = "Только кириллица, латиница и тире, первая буква - заглавная.",
    ILLEGAL_LOGIN = "Только латиница, подчёркивание и тире.",
    ILLEGAL_EMAIL = "Только латиница и спецсимволы, должны быть собака и точка.",
    TOO_SHORT_PWD = "От 8 до 40 символов",
    ILLEGAL_PWD = "Латиница, цифры и спецсимволы, хотя бы по одной заглавной букве и цифре.",
    ILLEGAL_PHONE = 'От 10 до 15 цифр, может начинаться с "+".',
    EMPTY = "Не пустая строка.",
    PASSWORDS_NOT_SAME = "Пароли не совпадают",
}

export default class Validator {
    private static _instance: Validator;

    private static getParentComponent(node: HTMLElement): BaseComponent | undefined {
        let result = node.parentElement;
        if (result) {
            if (result instanceof BaseComponent) {
                return result;
            } else {
                return this.getParentComponent(result);
            }
        }
    }

    private static validate(input: HTMLInputElement, callback: (result: string | null) => void): void {
        let result = null;
        const value = input.value;

        switch (input.name) {
            case "first_name":
            case "second_name":
                result = /[A-ZА-ЯЁё]+[A-zА-яЁё-]+/g.test(value) ? null : ERRORS.ILLEGAL_CHARS;
                break;

            case "login":
                result = /^(?=.*[A-Z])(?=.*[a-zA-Z])(?=.*[^\d\s])[A-Z][a-zA-Z0-9_-]{2,19}$/g.test(value)
                    ? null
                    : ERRORS.ILLEGAL_CHARS;
                break;

            case "email":
                result = /^[a-zA-Z0-9._%±]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/g.test(value) ? null : ERRORS.ILLEGAL_EMAIL;
                break;

            case "password":
            case "password2":
            case "oldPassword":
                if (value.length < 8 || value.length > 40) {
                    result = ERRORS.TOO_SHORT_PWD;
                } else {
                    result = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d\W]{8,40}$/g.test(value) ? null : ERRORS.ILLEGAL_PWD;
                }
                break;

            case "phone":
                result = /^\+?\d{10,15}/g.test(value) ? null : ERRORS.ILLEGAL_PHONE;
                break;

            case "message":
                result = /^(?=\S).+/g.test(value) ? null : ERRORS.EMPTY;
                break;
        }

        if (!result && input.value.length < 3) result = ERRORS.TOO_SHORT;

        input.setCustomValidity(result?.toString() || "");

        callback(result);
    }

    private static setError(input: HTMLInputElement, error: string | null) {
        const fInput: BaseComponent | undefined = this.getParentComponent(input);
        if (fInput) {
            setTimeout(() => (fInput.proxy.error = error), 0);
        }
    }

    public static validateForm(form: HTMLFormElement): boolean {
        const inputs = form.getElementsByTagName("input");
        const inputArray = Array.from(inputs);
        inputArray.forEach((input) => {
            this.validate(input, (result) => {
                this.setError(input, result);
            });
        });

        const password = inputArray.filter((input) => input.name === "password")[0];
        const password2 = inputArray.filter((input) => input.name === "password2")[0];

        if (password && password2 && password.value != password2.value) {
            this.setError(password, ERRORS.PASSWORDS_NOT_SAME);
            this.setError(password2, ERRORS.PASSWORDS_NOT_SAME);
            password.setCustomValidity(ERRORS.PASSWORDS_NOT_SAME.toString());
            password2.setCustomValidity(ERRORS.PASSWORDS_NOT_SAME.toString());
        }

        return form.checkValidity();
    }

    public static validateEvent(event: Event) {
        const target = event.target as HTMLInputElement;

        this.validate(target, (result: string | null) => {
            this.setError(target, result);
        });
    }

    public static get i() {
        return this._instance || (this._instance = new this());
    }
    private constructor() {}
}
