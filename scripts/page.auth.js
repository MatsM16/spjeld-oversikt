import { AppEvent } from "./event.app.js";
import { PersonService } from "./service.person.js";
import { UserService } from "./service.user.js";

AppEvent.onload = app =>
{
    const personService = app.services.get(PersonService);
    const userService = app.services.get(UserService);

    let innerHtml = ""
    for (const person of personService.getPeople())
    {
        innerHtml += `
        <label for="person_${person.id}">
            <input id="person_${person.id}" value="${person.id}" onchange='handlePersonSelected(${JSON.stringify(person)})' name="person" type="radio" /><span>${person.firstName} ${person.lastName}</span>
        </label>`
    }
    innerHtml += `
    <button id="ok" onclick="handleOkClicked()" disabled>
        OK
    </button>`

    const container = document.querySelector("main div");
    container.innerHTML = innerHtml;

    const handlePersonSelected = person =>
    {
        document.querySelector("#ok").disabled = false;

        if (document.querySelector("#person_" + person.id).checked)
            userService.setUser(person)
    }
    window.handlePersonSelected = handlePersonSelected;

    const handleOkClicked = () =>
    {
        if (document.querySelector("#ok").disabled) return;
        location.href = "./";
    }
    window.handleOkClicked = handleOkClicked;
}