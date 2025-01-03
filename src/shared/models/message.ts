export class Message {
    text: string = '';
    date: Date = new Date();
    time: string = '';
    read: boolean = false;
    my: boolean = false;

    get dateHM() {
        return `${this.date.getHours()}:${this.date.getMinutes()}`;
    }

    get dateDay() {
        const dateString = this.date.toLocaleString('ru',{day: '2-digit', month: 'long', year: 'numeric'});
        return dateString.substring(0, dateString.length - 3);
    }

    constructor(data: {
        text: string, date: string, read: boolean, my: boolean
    }) {
        this.text = data.text;
        this.read = data.read;
        this.my = data.my;
        this.date = new Date(data.date);
        this.time = this.dateHM; //Handlebars won't call this due to security restrictions
    }
}