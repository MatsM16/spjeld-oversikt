export class ServiceCollection
{
    /** @type {ServiceCollection} */
    static get global()
    {
        let collection = window["SERVICE_COLLECTION"];

        if (!collection)
        {
            collection = new ServiceCollection();
            window["SERVICE_COLLECTION"] = collection;
        }

        return collection
    }

    constructor()
    {
        this._initializedSingletons = new Map();
        this._singletons = new Map();
        this._transients = new Map();
    }

    setGlobalCollection()
    {
        window["SERVICE_COLLECTION"] = this;
    }

    /**
     * @param {Function} type 
     * @param {(services: (type: Function) => any) => any} initialize 
     * @returns {ServiceCollection}
     */
    addSingleton(type, initialize)
    {
        this._singletons.set(type, initialize);
        return this;
    }

    /**
     * @param {Function} type 
     * @param {(services: (type: Function) => any) => any} initialize 
     * @returns {ServiceCollection}
     */
    addTransient(type, initialize)
    {
        this._transients.set(type, initialize);
        return this;
    }

    /**
     * @template T
     * @param {{new(...args:any[]): T}} type 
     * @returns {T}
     */
    get(type)
    {
        if (this._initializedSingletons.has(type))
            return this._initializedSingletons.get(type);

        if (this._singletons.has(type))
        {
            const singleton = this._singletons.get(type)(this.get.bind(this));
            this._initializedSingletons.set(type, singleton);
            return singleton;
        }

        if (this._transients.has(type))
            return this._transients.get(type)(this.get.bind(this));

        throw new Error("No service found for: " + type);
    }
}