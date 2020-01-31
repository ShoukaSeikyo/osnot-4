//#Browser, Settings, Channel, Storage;

let INSTANCE;
const Patreon = class {

    static get URL() {
        return Settings.getValue('server-url', `http://localhost:99`);
    }

    constructor() {
        this.clientID = 'gBHasu6tc3uv5Gi73KD_I_ePyr4cG5GPGE-_pEGsgn3CB7XZPg6Hu3JL6dSQlfrm';
        this.extPath = chrome.runtime.getURL(`/patreon/redirect.html`);
        this.redirect = `${ Patreon.URL }/redirect`;

        this.osnotToken = Storage.get('osnot-token', false);
        INSTANCE = this;

        this.untilCheck = 0;
        this.lastCheck = false;
    }

    get url() {
        return `https://www.patreon.com/oauth2/authorize?` +
        `response_type=code` +
        `&client_id=${ this.clientID }` +
        `&redirect_uri=${ this.redirect }` +
        `&state=${ this.extPath }`;
    }

    open() {
        Browser.open(this.url);
    }

    async check(force = false) {
        if(force || this.untilCheck <= new Date().getTime()) {
            this.untilCheck = new Date().getTime() + ( 43200 * 1e3 );
            this.lastCheck = await (await fetch(`${ Patreon.URL }/token?token=${ this.osnotToken.token || false }`)).json();

            
            const ServerLimits = await (await fetch(`${ Settings.getValue('server-url', `http://localhost:99`) }/limits`)).json();
            //#Server;
            Server.constructor.maxPerPool = ServerLimits[await this.check() ? "premium" : "regular"].limitPerCo;
        }

        return this.lastCheck;
    }

    save() {
        Storage.set('osnot-token', this.osnotToken);
        Storage.save();
    }

};

App.register('Patreon', new Patreon());

Channel.get('patreon')
    .subscribe('token', async ({ token = false }) => {
        INSTANCE.osnotToken = token;
        INSTANCE.save();
        INSTANCE.check(true);
        Browser.closeTab();
    })
    .subscribe('open', async () => {
        INSTANCE.open();
    })
    .subscribe('premium', async () => {
        return await INSTANCE.check();
    });