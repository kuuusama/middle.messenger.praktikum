import { Injectable } from "./injection";
import { Route } from "./route";

export
@Injectable()
class Router {
    private routes: Array<Route> = [];
    private history: History = window.history;
    private currentRoute: Route | null = null;
    private rootQuery: string = "";
    private window: Window = globalThis.window;

    public use(pathname: string, block: CustomElementConstructor) {
        const route = new Route(pathname, block, {rootQuery: this.rootQuery});
        this.routes.push(route);
        return this;
    }
  
    public start() {
        this.window.addEventListener('popstate', (event: any) => {
            this.onRoute(event.currentTarget.location.pathname);
        });
  
        this.onRoute(window.location.pathname);
    }
  
    private onRoute(pathname: string) {
        const route = this.getRoute(pathname) || null;

        if (this.currentRoute) {
            this.currentRoute.leave();
        }

        if (route) {
            this.currentRoute = route;
            route.render();
        } else {
            this.go('/404')
        }
    }

    public go(pathname: string) {
        this.history.pushState({}, "", pathname);
        this.onRoute(pathname);
    }
  
    public back() {
        this.history.back();
    }
  
    public forward() {
        this.history.forward();
    }
  
    private getRoute(pathname: string): Route | null {
        return this.routes.find(route => route.match(pathname)) || null;
    }

    private constructor() {
        this.currentRoute = null;
    }
  }
