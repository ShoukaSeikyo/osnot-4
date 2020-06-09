//#ScannerBase as Scanner;

const ChromeScanner = class extends Scanner {

    constructor() {
        super();

        chrome.runtime.onMessage.addListener(data => this.handleURL(data));
    }

    retrieveTab() {
        chrome.tabs.query({ active: true, currentWindow: true, windowId: chrome.windows.WINDOW_ID_CURRENT }, async tabs => {
            for (let i = 0; i < tabs.length; i++) {
                const tab = tabs[i];
                if (!tab.hasOwnProperty('url') || tab.url.indexOf('chrome://') > -1) {
                    return;
                }

                chrome.tabs.executeScript(tab.id, {
                    code: `
                    chrome.runtime.sendMessage({
                        tab: '${ tab.url}',
                        url: location.href
                    }, () => {});
                `, allFrames: true
                }, () => { });
            }
        });
    }

};

App.register('Scanner', new ChromeScanner());