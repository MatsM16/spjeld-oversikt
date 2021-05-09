import { DatabaseService } from "./service.database.js";
import { PersonService } from "./service.person.js";
import { SlotService } from "./service.slots.js";
import { UserService } from "./service.user.js";
import { ServiceCollection } from "./service.servicecollection.js";
import { AppEvent } from "./event.app.js";

(() =>
{
    var firebaseConfig = {
        apiKey: "AIzaSyAVtIHwC58eJhWKPMbFSuZ7FldYYIsPO0k",
        authDomain: "dyroydevelopment.firebaseapp.com",
        databaseURL: "https://dyroydevelopment.firebaseio.com",
        projectId: "dyroydevelopment",
        storageBucket: "dyroydevelopment.appspot.com",
        messagingSenderId: "880208551926",
        appId: "1:880208551926:web:72276ccf137d3590e1b1d7"
    };
    firebase.initializeApp(firebaseConfig);

    if ('serviceWorker' in navigator)
        navigator.serviceWorker.register("./worker.main.js");

    ServiceCollection.global
        .addSingleton(PersonService, () => new PersonService())
        .addSingleton(UserService, get => new UserService(get(PersonService)))
        .addSingleton(DatabaseService, () => new DatabaseService())
        .addSingleton(SlotService, get => new SlotService(get(PersonService), get(UserService), get(DatabaseService)));


    new AppEvent(ServiceCollection.global).dispatch();
})();