class Config {
    getMongoConnectUri() {
        const username = process.env.DB_USER || "admin";
        const password = process.env.DB_PASS || "admin1234";
        const hostname = process.env.DB_HOST || "cluster0.2cacp.mongodb.net";
        const dbname = process.env.DB_NAME || "tictactoe";
        return `mongodb+srv://${username}:${password}@${hostname}/${dbname}?retryWrites=true&w=majority`;
    }
}

export default new Config();