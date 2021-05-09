declare type Person = {
    readonly id: string;
    readonly firstName: string;
    readonly lastName: string;
}

declare type Slot = {
    readonly id: string;
    readonly date: Date;
    readonly type: "house" | "annex" | "jaquzzi";
    readonly reservedBy?: Person;
    readonly wantedBy?: Person;
}