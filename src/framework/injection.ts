interface IContainerProvider {
    useValue: unknown;
    token: string;
}

class Container {
    private providers: { [key: string]: unknown } = {};

    public resolve(token: string) {
        const matchedProviderKey = Object.keys(this.providers).find(key => key === token);
        const matchedProvider = matchedProviderKey ? this.providers[matchedProviderKey] : undefined;

        if (matchedProvider) {
            return matchedProvider;
        } else {
            throw new Error(`No provider found for ${token}!`);
        }
    }

    public provide(details: IContainerProvider): void {
        this.providers[details.token] = details.useValue;
    }
}
  
const container = new Container();

export function Injectable(): Function {
    return function(target: { new (): unknown }): void {
        container.provide({
            token: target.name,
            useValue: new target()
        });
    };
}

export function Inject(token: string) {
    return function(target: unknown, key: string) {
        Object.defineProperty(target, key, {
            get: () => container.resolve(token),
            enumerable: true,
            configurable: true
        });
    };
}
