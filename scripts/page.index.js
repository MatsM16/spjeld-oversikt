import { AppEvent } from "./event.app.js"
import { PersonService } from "./service.person.js";
import { SlotService } from "./service.slots.js"
import { UserService } from "./service.user.js";

AppEvent.onload = evt =>
{
    const slotService = evt.services.get(SlotService);
    const userService = evt.services.get(UserService);
    const personService = evt.services.get(PersonService);

    slotService.onchange.add(() =>
    {
        renderSlots();
    })

    /** @param {Slot[]} slots */
    const renderSlots = () =>
    {

        const slotStatus = slot =>
        {
            if (slot.reservedBy)
                return slot.reservedBy.id == user.id ? "reserved" : "taken";
            if (slot.wantedBy)
                return "wanted";
            return "available";
        }

        const slotDisplayStatus = slot =>
        {
            if (slot.reservedBy)
            {
                if (slot.reservedBy.id == user.id)
                    return "Reservert av <span class='person'>deg</span>";

                const person = personService.getPerson(slot.reservedBy.id);
                return `Reservert av <span class="person" title="${person.firstName} ${person.lastName}">${person.firstName}</span>`
            }

            if (slot.wantedBy)
            {
                if (slot.wantedBy.id == user.id)
                    return "Ønsket av <span class='person'>deg</span>";

                const person = personService.getPerson(slot.wantedBy.id);
                return `Ønsket av <span class="person" title="${person.firstName} ${person.lastName}">${person.firstName}</span>`
            }

            return "Ledig";
        }

        const slotDisplayType = slot =>
        {
            if (slot.type === "home") return "Hus";
            if (slot.type === "annex") return "Annex";
            if (slot.type === "jacuzzi") return "Jacuzzi";
            if (slot.type === "outside") return "Uteområde";
            return "";
        }

        const displayTime = time =>
        {
            const date = new Date(time);
            const day = ["Søndag", "Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag"][date.getDay()]
            const month = ["januar", "februar", "mars", "april", "mai", "juni", "juli", "august", "september", "november", "desember"][date.getMonth()]
            return `${day} ${date.getDate()}. ${month}`;
        }

        const slots = slotService.getSlots(new Date(2021, 4, 12), new Date(2021, 4, 17));

        const days = groupBy(slots, slot => slot.date.getTime())
        const container = document.querySelector("main");
        const user = userService.getUser();

        container.innerHTML = days.map(({value, group}) => `
        <section class="date" title="${displayTime(value)}">
            ${group.map(slot => `
            <div class="slot slot--${slotStatus(slot)}" onclick='window.handleSlotClicked(${JSON.stringify(slot)})'>
                <div class="slot__type">${slotDisplayType(slot)}</div>
                <div class="slot__status">${slotDisplayStatus(slot)}</div>
            </div>
            `).join("")}
        </section>
        `).join("");
    }

    /** @param {Slot} slot */
    const handleSlotClicked = slot =>
    {
        const user = userService.getUser();

        if (slot.reservedBy)
            return slot.reservedBy.id == user.id ? slotService.wish(slot) : undefined;

        if (slot.wantedBy && slot.wantedBy.id == user.id)
            return slotService.release(slot);

        slotService.reserve(slot);
    }
    window.handleSlotClicked = handleSlotClicked;

    if (!userService.hasUser())
    {
        location.href = "./auth.html";
        return;
    }
    document.querySelector("#name").innerHTML = userService.getUser().firstName;
    document.querySelector("#name").onclick = () => location.href = "./auth.html";
    renderSlots();
}

/**
 * @template T
 * @template TValue
 * @param {T[]} array 
 * @param {(value: T) => TValue} getKey 
 * @returns {{value: TValue, group: T[]}[]}
 */
function groupBy(array, getKey)
{
    const map = new Map();
    for (const item of array)
    {
        const key = getKey(item);
        map.has(key)
            ? map.get(key).push(item)
            : map.set(key, [item]);
    }

    const result = [];
    for (const key of map.keys())
        result.push({value:key, group:map.get(key)})
    return result;
}