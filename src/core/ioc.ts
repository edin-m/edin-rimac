export class IoC {
    private map = new Map();

    register(name: string, impl: any): void {
        this.map.set(name, impl);
    }

    resolve<Type>(name: string): Type {
        return this.map.get(name) as Type;
    }

    static GlobalServices = {
        pubsub: 'pubsub'
    }
}
