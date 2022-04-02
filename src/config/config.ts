class Config {
    environment = 'test';

    getMongoConnectUri() {
        if (/test/.test(this.environment)) {
            // normally these values would be injected through env vars
            const username = "admin" || process.env.DB_USER;
            const password = "admin1234" || process.env.DB_PASS;
            const hostname = "cluster0.2cacp.mongodb.net" || process.env.DB_HOST;
            const dbname = "tictactoe" || process.env.DB_NAME;
            return `mongodb+srv://${username}:${password}@${hostname}/${dbname}?retryWrites=true&w=majority`;
        }
        return '';
    }
}

export default new Config();