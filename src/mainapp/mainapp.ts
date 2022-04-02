import { Server } from "http";
import mongoose from "mongoose";
import { merge } from 'lodash';
import { Logger } from "tslog";
import { DocumentNode } from "graphql";
import { mergeTypeDefs } from "@graphql-tools/merge";
import { ApolloServer } from "apollo-server-express";

import { createGraphQLServer } from "../core/graphql.server";
import { App, Module } from "../core/interfaces";
import { IoC } from "../core/ioc";
import dummyGql from "./dummy.gql";
import { PubSub } from "graphql-subscriptions";
import { GameModule } from "../game/module";
import config from '../config/config';

export class MainApp implements App {
    ioc: IoC = new IoC();

    private resolvers = {};
    private typeDefs: DocumentNode = dummyGql;
    private httpServer: Server;
    private apolloServer: ApolloServer;

    constructor() {
        const _ = new Logger({ name: 'MainApp', overwriteConsole: true });
        this.ioc.register('pubsub', new PubSub());
    }

    async start(): Promise<void> {
        await this.connectToMongo();
        this.loadModules();
        [this.httpServer, this.apolloServer] = await createGraphQLServer(this.typeDefs, this.resolvers);
    }

    async stop(): Promise<void> {
        await this.apolloServer.stop();
        await this.httpServer.close();
    }

    private async connectToMongo(): Promise<void> {
        const MONGODB = config.getMongoConnectUri();
        try {
            await mongoose.connect(MONGODB);
            console.log('Connected to MongoDB');
        } catch (e) {
            console.error('Error connecting to mongo', JSON.stringify(e));
            process.exit(1);
        }
    }

    private loadModules(): void {
        for (const module of this.getModules()) {
            module.register(this);
        }
    }

    private getModules(): [Module] {
        return [
            new GameModule(this.ioc)
        ];
    }

    installResolvers(resolvers: object): void {
        this.resolvers = merge(this.resolvers, resolvers);
    }

    installTypeDefs(typeDefs: DocumentNode): void {
        this.typeDefs = mergeTypeDefs([this.typeDefs, typeDefs]);
    }
}