import {PersonService} from "./service.person.js"

export class UserService
{
    constructor(personService)
    {
        /** @type {PersonService} */
        this._personService = personService;
    }

    /**
     * @returns {Person | undefined}
     */
    getUser()
    {
        const id = localStorage.getItem("selected-user");
        return this._personService.getPerson(id);
    }

    /**
     * @param {Person} user 
     */
    setUser(user)
    {
        localStorage.setItem("selected-user", user.id);
    }

    hasUser()
    {
        return !!localStorage.getItem("selected-user")
    }
}