import { UserInputError } from "apollo-server-core";

export class NotFoundError extends UserInputError {
    constructor(name: string, id: string) {
        super(`Resource ${name}(${id})) not found`);
    }
}