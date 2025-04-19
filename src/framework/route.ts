import { BaseComponent } from "./basecomponent";

export interface IRouteSettings {
    rootQuery: string;
}

export class Route {
    private pathname: string;
    private props: IRouteSettings;
    private block: BaseComponent | null;
    private componentConstructor: CustomElementConstructor;

    constructor(pathname: string, view: CustomElementConstructor, props: IRouteSettings) {
        this.pathname = pathname;
        this.componentConstructor = view;
        this.block = null;
        this.props = props;
    }
  
    navigate(pathname: string): void {
        if (this.match(pathname)) {
            this.pathname = pathname;
            this.render();
        }
    }
  
    leave(): void {
        this.block?.hide();
    }
  
    match(pathname: string): boolean {
        if (Array.isArray(pathname)) {
            pathname = pathname[0];
        }
        return pathname === this.pathname;
    }
  
    render() {
        if (!this.block) {
            this.block = new this.componentConstructor() as BaseComponent;
            document.getElementById('routerOutlet')?.appendChild(this.block);
            this.block?._render();
            return;
        }

        this.block.show();
    }

    getProps(): IRouteSettings {
        return this.props;
    }
}
