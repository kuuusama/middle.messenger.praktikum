export class Message {
    id: number = 0;
    content: string = "";
    date: Date = new Date();
    time: string = "";
    internalTime: string = "";
    is_read: boolean = false;
    my: boolean = false;

    get dateHM() { //Handlebars won't call this due to security restrictions
        return this.date.toTimeString().split(' ')[0].slice(0, -3);
    }

    get dateDay() {
        const dateString = this.date.toLocaleString("ru", { day: "2-digit", month: "long", year: "numeric" });
        return dateString.substring(0, dateString.length - 3);
    }

    constructor(data: { [key:string]: string | boolean | number}) {
        /*
            content: "qqqqq"
            file: null
            time: "2025-02-05T06:29:20+00:00"
        */

        this.id = data.id as number;
        this.is_read = data.is_read as boolean;
        this.content = data.content as string;
        this.my = data.my as boolean;
        this.time = data.time as string;
        this.date = new Date(data.time as string);
        this.internalTime = this.date.toTimeString().split(' ')[0].slice(0, -3);
        console.log('Message parsed');
        console.log(this);
    }
}
