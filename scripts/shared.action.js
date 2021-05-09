export class Action
{
    constructor()
    {
        this._listeners = [];
        this._listener = new ActionListener(this);
    }

    invoke()
    {
        for (const listener of this._listeners)
            if (listener) listener();
    }

    /** @param {Function} callback */
    add(callback)
    {
        this._listeners.push(callback);
    }

    /** @param {Function} callback */
    remove(callback)
    {
        const index = this._listeners.indexOf(callback);
        if (index == -1) return;
        this._listeners.splice(index, 1);
    }

    /** @readonly */
    get listener()
    {
        return this._listener;
    }
}

class ActionListener
{
    constructor(action)
    {
        this._action = action;
    }

    /** @param {Function} callback */
    add(callback)
    {
        this._action.add(callback)
    }

    /** @param {Function} callback */
    remove(callback)
    {
        this._action.remove(callback)
    }
}