//#BrowserBase as Browser,
//ImageCache;

const ChromeBrowser = class extends Browser {
    constructor() {
        super('chrome');
    }

    get lang() {
        return chrome.i18n.getUILanguage().substring(0, 2);
    }

    text(key, keyVars = {}) {
        return super.text(chrome.i18n.getMessage(key), keyVars);
    }

    open(url) {
        chrome.tabs.create({ url: url });
    }

    popup(url) {

    }

    closeTab() {
        chrome.tabs.query({ active: true, currentWindow: true, windowId: chrome.windows.WINDOW_ID_CURRENT }, async tabs => {
            for (let i in tabs) {
                chrome.tabs.remove(tabs[i].id, () => { });
            }
        });
    }

    get version() {
        return chrome.runtime.getManifest().version;
    }
};

App.register('Browser', new ChromeBrowser());