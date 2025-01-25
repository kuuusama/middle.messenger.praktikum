export default interface IUser {
    id?: number;
    email: string;
    login: string;
    first_name: string;
    second_name: string;
    display_name: string;
    phone: string;
    avatar: string;
    password: string;
    [key: string]: string | number | undefined;
}
