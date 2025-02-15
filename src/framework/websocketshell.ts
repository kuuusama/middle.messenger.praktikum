import { EventBus } from "./eventbus";

export class WebSocketShell {
    private socket: WebSocket | null = null;
    private baseUrl: string = 'wss://ya-praktikum.tech/ws/chats';
    private pingTimer: number | undefined = undefined;
    private bus: EventBus = new EventBus();
    private pingData = JSON.stringify({type: "ping"});

    private initSocket(): void {
        if (this.socket) {
            this.socket.onmessage = (event) => {
                if('WS token is not valid' === event.data) {
                    clearInterval(this.pingTimer);
                    this.bus.emitIfListenersExists('token_invalid');
                } else {
                    this.bus.emitIfListenersExists('message', event.data);
                }
            }
            this.socket.onerror = (event) => this.bus.emitIfListenersExists('error', (event as MessageEvent).data);
            this.socket.onclose = (event) => {
                this.bus.emitIfListenersExists('close', event.wasClean ? 'clean' : 'disconnect');
            };
            this.socket.onopen = (event) => {this.bus.emitIfListenersExists('open', event);}
            this.pingTimer = setInterval(() => this._send(this.pingData), 60000);
        }
    }

    private _send(data: string) {
        if(1 === this.socket?.readyState) {
            this.socket.send(data);
        }
    }

    public on(event: string, callback: Function): void {
        this.bus.on(event, callback);
    }

    public off(event: string, callback: Function): void {
        this.bus.off(event, callback);
    }

    public open(userId: number, chatId: number, token: string) {
        this.socket = new WebSocket(`${this.baseUrl}/${userId}/${chatId}/${token}`);
        this.initSocket();
    }

    public close() {
        clearInterval(this.pingTimer);
        this.socket?.close();
    }

    public send(message: string): void {
        const payload = {
            type: "message",
            content: message,
        };
        this.socket?.send(JSON.stringify(payload));
    }

    public getHistory(offset: number = 0):void {
        const payload = {
            type: "get old",
            content: offset,
        };
        this.socket!.send(JSON.stringify(payload));
    }
}

