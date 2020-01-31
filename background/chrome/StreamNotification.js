//#Browser, ImageCache, StreamNotificationBase as StreamNotification;

const NotificationList = {};
const BR = "\n";

const ChromeStreamNotification = class extends StreamNotification {
    static get(id) {
        return NotificationList[id];
    }

    static exists(id) {
        return NotificationList.hasOwnProperty(id);
    }

    constructor(stream) {
        super(stream);
        this.notificationID;
        this.dismissID;

        ImageCache.getBase64(stream.cache.avatar).then((base64) => {
            chrome.notifications.create({
                type: 'basic',
                iconUrl: base64,
                title: stream.cache.customUsername.length > 0 ? stream.cache.customUsername : stream.cache.username,
                message: stream.cache.game + BR + stream.cache.title,
                buttons: [
                    { title: Browser.text('NOTIFICATION_DESKTOP_OPEN') },
                    { title: Browser.text('NOTIFICATION_DESKTOP_DISMISS') }
                ]
            }, (id) => {
                NotificationList[id] = this;
                this.notificationID = id;
                this.dismissID = setTimeout(() => {
                    this.dismiss();
                }, 30e3);
            });
        });
    }

    open() {
        super.open();
        this.dismiss();
    }

    dismiss() {
        chrome.notifications.clear(this.notificationID);
        delete NotificationList[this.notificationID];
        clearTimeout(this.dismissID);
    }
};

chrome.notifications.onButtonClicked.addListener((id, index) => {
    if (!ChromeStreamNotification.exists(id)) {
        return;
    }

    const notification = ChromeStreamNotification.get(id);
    index === 0 && notification.open();
    index === 1 && notification.dismiss();
});

App.register('StreamNotification', ChromeStreamNotification);