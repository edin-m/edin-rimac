
import { App } from "./core/interfaces";
import { MainApp } from "./mainapp/mainapp";

const app: App = new MainApp();

app.start()
    .then(console.log.bind(console))
    .catch(console.error.bind(console));
