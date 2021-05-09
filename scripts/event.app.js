export class AppEvent
{

    constructor(serviceCollection)
    {
        this._serviceCollection = serviceCollection;
        this._isDispatched = false;
    }

    dispatch()
    {
        if (this._isDispatched) return;
        this._isDispatched = true;

        const event = new Event("app_load");
        event.appEvent = this;
        
        window["APP"] =  this;
        window.dispatchEvent(event);
    }

    get services()
    {
        return this._serviceCollection;
    }
    /**
     * @param {(appEvent: AppEvent) => any} callback
     */
    static set onload(callback)
    {
        if (window["APP"]) callback(window["APP"]);

        window.addEventListener("app_load", event =>
        {
            if (window["APP"]) callback(window["APP"]);
            else window["APP"] = event.appEvent;
        })
    }
}