//#Throttle, StorageBase as Storage;

const ChromeStorage = class extends Storage {
    constructor(mainNode = {}) {
        super(mainNode);

        this.saveThrottle = new Throttle().setMode(Throttle.MODE.LAST).setCallback(async () => {
            chrome.storage.local.set({'v4': this.mainNode.toStorage});
        });
    }

    save() {
        this.saveThrottle.call(1000);
        return super.save();
    }
};

chrome.storage.local.get(['v4'], ({ v4 }) => {
    App.register('Storage', new ChromeStorage(v4 ? v4 : {}));
});
