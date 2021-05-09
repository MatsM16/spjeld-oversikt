export class PersonService
{
    /** @returns {Person[]} */
    getPeople()
    {
        return [
            {
                id: "ms",
                firstName: "Mats",
                lastName: "Steffensen"
            },
            {
                id: "md",
                firstName: "Mats",
                lastName: "Dyrøy"
            },
            {
                id: "ed",
                firstName: "Emil",
                lastName: "Dyrøy"
            },
            {
                id: "ss",
                firstName: "Sander",
                lastName: "Steffensen"
            },
            {
                id: "td",
                firstName: "Thea",
                lastName: "Dyrøy"
            }
        ]
    }

    getPerson(personId)
    {
        if (!personId) return undefined;

        const people = this.getPeople().filter(({id}) => id == personId);

        return people.length == 1 ? people[0] : undefined;
    }
}