//#Channel;

let INSTANCE;

const Browser = class {
    constructor() {
        INSTANCE = this;
    }

    get name() { return 'unknown'; }
    get lang() { return 'en'; }

    text(text, keyVars = {}) {
        for (let keyVar in keyVars) {
            text = text.replace(new RegExp(`{${keyVar}}`, 'gi'), keyVars[keyVar]);
        }
        return text;
    }

    popup(url) { }

    open(url) { }

    closeTab() { }

    get version() { return ''; }
};

Channel.get('browser')
    .subscribe('infos', async () => {
        return {
            name: INSTANCE.name,
            lang: INSTANCE.lang,
            version: INSTANCE.version
        };
    })
    .subscribe('open', async ({ url = '' }) => {
        INSTANCE.open(url);
        return true;
    })
    .subscribe('popup', async ({ url = '' }) => {
        INSTANCE.popup(url);
        return true;
    })
    .subscribe('text', async ({ keys = null, key = '', keyVars = {} }) => {
        if (Array.isArray(keys)) {
            const texts = {};
            keys.forEach(_key => texts[_key] = INSTANCE.text(_key));
            return keys;
        }

        return INSTANCE.text(key, keyVars);
    });

App.register('BrowserBase', Browser);
