//#Channel, Stream, Settings;

let INSTANCE;
const Scanner = class {

    static get URL() {
        return Settings.getValue('server-url');
    }

    constructor() {
        INSTANCE = this;
        this.addList = [];
        this.ignored = [];
        this.scanned = [];

        this.regexps = [];

        fetch(`${Scanner.URL}/list`).then(async r => {
            if(r.ok) {
                (await r.json()).forEach(regex => {
                    regex.exp = new RegExp(regex.exp.slice(1, -1));
                    this.regexps.push(regex);
                })
            }
        });
    }

    async retrieveTab() {}

    async handleURL({ tab: tabURL, url }) {
        if(this.scanned.indexOf(url) > -1) {
            return false;
        }

        this.scanned.push(url);

        for(let i in this.regexps) {
            const { tab, exp, mode, id } = this.regexps[i];
            if(!exp.test(url)) {
                continue;
            }

            const value = exp.exec(url)[1];
            const retrieved = await (await fetch(`${Scanner.URL}/scanner?service=${id}&mode=${mode}&value=${value}`)).json();
            if(retrieved !== false && !Stream.has(retrieved.fullID) && this.ignored.indexOf(retrieved.fullID) === -1) {
                if(tab) {
                    retrieved.cache.customURL = tabURL;
                }

                this.addList.push(retrieved);
                if(this.addList.length < 2) {
                    Channel.get('scanner').dispatch('retrieved', retrieved);
                }
            }
        }
    }

    remove(fullID) {
        return this.addList.splice(this.addList.findIndex(({ fullID: _fullID }) => _fullID === fullID), 1)[0];
    }

    get first() {
        this.retrieveTab();
        if(this.addList.length > 0) {
            return this.addList[0];
        }

        return false;
    }

    sendNext() {
        if(this.first === false) {
            return;
        }

        Channel.get('scanner').dispatch('retrieved', this.first);
    }
};

Channel.get('scanner')
    .subscribe('get', async () => { 
        INSTANCE.retrieveTab();
    })
    .subscribe('add', async ({ fullID }) => {
        const { cache } = INSTANCE.remove(fullID);
        Channel.get('stream').dispatch('add', new Stream(fullID).setCache(cache, false).asInfo);
        Stream.save();

        INSTANCE.sendNext();
    })
    .subscribe('ignore', async ({ fullID }) => {
        INSTANCE.ignored.push( INSTANCE.remove(fullID).fullID );
        
        INSTANCE.sendNext();
    })
    .subscribe('first', async () => {
        return INSTANCE.first;
    });

App.register('ScannerBase', Scanner);