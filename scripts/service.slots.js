import {Action} from "./shared.action.js";
import {PersonService} from "./service.person.js";
import {UserService} from "./service.user.js";
import {DatabaseService} from "./service.database.js";

export class SlotService
{
    /**
     * @param {PersonService} personService 
     * @param {UserService} userService 
     * @param {DatabaseService} databaseService 
     */
    constructor(personService, userService, databaseService)
    {
        
        this._onChangeAction = new Action();

        /** @type {Map<string, ReservationDto>} */ 
        this._reservations = new Map();

        /** @type {Map<string, WishDto>} */ 
        this._wishes = new Map();

        this._personService = personService;
        this._userService = userService;

        const reservations = localStorage.getItem("slot-reservations");
        if (reservations)
            for (const reservation of JSON.parse(reservations))
                this._reservations.set(reservation.slotId, reservation);

        const wishes = localStorage.getItem("slot-wishes");
        if (wishes)
            for (const wish of JSON.parse(wishes))
                this._wishes.set(wish.slotId, wish);

        this._reservationDb = databaseService.open({
            path: "/spjeld/reservations",
            onAdd: reservation => {
                this._reservations.set(reservation.slotId, reservation);
                this._onChangeAction.invoke();
            },
            onRemove: reservation => {
                this._reservations.delete(reservation.slotId);
                this._onChangeAction.invoke();
            }
        })

        this._wishDb = databaseService.open({
            path: "/spjeld/wishes",
            onAdd: wish => {
                this._wishes.set(wish.slotId, wish);
                this._onChangeAction.invoke();
            },
            onRemove: wish => {
                this._wishes.delete(wish.slotId);
                this._onChangeAction.invoke();
            }
        })

        this._onChangeAction.add(() =>
        {
            localStorage.setItem("slot-reservations", JSON.stringify([...this._reservations.values()]))
            localStorage.setItem("slot-wishes", JSON.stringify([...this._wishes.values()]))
        })
    }

    /**
     * Gets slots in selected range
     * @param {Date} from 
     * @param {Date} to 
     */
    getSlots(from, to)
    {
        from = new Date(from.getFullYear(), from.getMonth(), from.getDate());
        to   = new Date(  to.getFullYear(),   to.getMonth(),   to.getDate());

        if (!from || !to || from.getTime() >= to.getTime())
            return [];

        const slots = [];
        let current = new Date(from);
        while (current <= to)
        {
            for (const type of ["home", "annex", "outside", "jacuzzi"])
            {
                const id = current.getTime() + "_" + type;

                const reservation = tryGet(this._reservations, id);
                const reservedBy = reservation ? this._personService.getPerson(reservation.personId) : undefined;
                const wanted = tryGet(this._wishes, id);
                const wantedBy = wanted ? this._personService.getPerson(wanted.personId) : undefined;

                slots.push({
                    id: id,
                    type: type,
                    date: new Date(current),
                    reservedBy: reservedBy,
                    wantedBy: wantedBy 
                });
            }

            current.setTime(current.getTime() + 24 * 60 * 60 * 1000);
        }

        return slots;
    }

    reserve(slot)
    {
        const person = this._userService.getUser();
        const reservation = {personId:person.id, slotId:slot.id}

        this._wishes.delete(slot.id);
        this._wishDb.delete(slot.id);

        this._reservations.set(slot.id, reservation);
        this._reservationDb.write(reservation, slot.id);

        this._onChangeAction.invoke();
    }

    wish(slot)
    {
        const person = this._userService.getUser();
        const wish = {personId:person.id, slotId:slot.id}

        this._reservations.delete(slot.id);
        this._reservationDb.delete(slot.id);

        this._wishes.set(slot.id, wish);
        this._wishDb.write(wish, slot.id);
        
        this._onChangeAction.invoke();
    }

    release(slot)
    {
        this._reservations.delete(slot.id);
        this._reservationDb.delete(slot.id);

        this._wishes.delete(slot.id);
        this._wishDb.delete(slot.id);

        this._onChangeAction.invoke();
    }

    get onchange()
    {
        return this._onChangeAction.listener;
    }
}

/**
 * @template TKey
 * @template TValue
 * @param {Map<TKey, TValue>} map 
 * @param {TKey} key 
 * @returns {TValue | undefined}
 */
function tryGet(map, key)
{
    return map.has(key) ? map.get(key) : undefined;
}