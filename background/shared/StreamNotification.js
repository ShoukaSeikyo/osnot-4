//#Browser;

const StreamNotification = class {
    constructor(stream) {
        this.stream = stream;
    }

    open() {
        Browser.open(this.stream.url);
    }

    dismiss() { }
};

App.register('StreamNotificationBase', StreamNotification);