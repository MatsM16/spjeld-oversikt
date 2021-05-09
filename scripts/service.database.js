export class DatabaseService
{
    constructor()
    {
        if (!firebase) 
        {
            this._database = {
                ref(path)
                {
                    return {
                        on(...args)
                        {
                            console.log("REF-ON", {path, args})
                        },

                        remove(...args)
                        {
                            console.log("REF-REMOVE", {path, args})
                        },

                        set(...args)
                        {
                            console.log("REF-SET", {path, args})
                        }
                    }
                }
            }
        }
        this._database = firebase.database()
    }

    /** @param {DataSubscription} subscription */
    open(subscription)
    {
        const ref = this._database.ref(subscription.path)
        ref.on("child_added", snap => subscription.onAdd(snap.val()))
        ref.on("child_removed", snap => subscription.onRemove(snap.val()))

        return new Database(this, subscription);
    }

    /** @param {DataSubscription} subscription */
    close(subscription)
    {

    }

    /** @param {DataSubscription} subscription */
    write(subscription, item, key)
    {
        const ref = this._database.ref(subscription.path.trimEnd("/") + "/" + key);
        ref.set(item);
    }

    /** @param {DataSubscription} subscription */
    delete(subscription, key)
    {   
        const ref = this._database.ref(subscription.path.trimEnd("/") + "/" + key);
        ref.remove();
    }
}

export class Database
{
    constructor(databaseService, subscription)
    {
        this._databaseService = databaseService;
        this._subscription = subscription;
    }

    write(item, key)
    {
        return this._databaseService.write(this._subscription, item, key);
    }

    delete(key)
    {
        return this._databaseService.delete(this._subscription, key);
    }

    close()
    {
        return this._databaseService.close(this._subscription);
    }
}