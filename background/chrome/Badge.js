//#BadgeBase as Badge,
//Settings;
const ChromeBadge = class extends Badge {

    constructor() {
        super();
        this.color('#B44F00');
        // this.icon('#800080');
        this.icon(Settings.getValue('icon-color'));
    }

    color(value) {
        chrome.browserAction.setBadgeBackgroundColor({ color: value });
    }

    text(value = '') {
        chrome.browserAction.setBadgeText({
            'text': super.text(value)
        });
    }

    async icon(color) {
        chrome.browserAction.setIcon({ imageData: await App.svgbase64((`▶(tray)`).replace(/#4BB0FF/gi, color)) }, () => { });
    }
};

App.register('Badge', new ChromeBadge());