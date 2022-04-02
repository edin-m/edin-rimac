import { DocumentNode } from "graphql";
import { IoC } from "./ioc";

export interface Module {
    register(app: App): void;
}

export interface App {
    ioc: IoC;

    start(): Promise<void>;
    stop(): Promise<void>;
    installResolvers(resolvers: object): void;
    installTypeDefs(typeDefs: DocumentNode): void;
}
