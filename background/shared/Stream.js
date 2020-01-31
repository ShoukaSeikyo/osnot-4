//#Storage, Browser, Badge, Throttle, Channel, AudioWrapper, StreamNotification, ImageCache;

const badgeThrottle = new Throttle().setMode(Throttle.MODE.LAST).setCallback(() => {
    const count = StreamList.filter(stream => stream.cache.online).length;
    Badge.text(count > 9999 ? '9999+' : count);
});

let GLOBAL_MUTE = false;
const StreamList = [];
const Stream = class {

    static list() {
        return StreamList;
    }

    static getByID(fullID) {
        return StreamList.find(stream => stream.fullID === fullID);
    }

    static has(fullID) {
        return Stream.getByID(fullID) !== undefined;
    }

    static save() {
        Storage.set('stream', Stream.toStorage);
        Storage.save();
    }

    static get toStorage() {
        return StreamList.map(stream => stream.toStorage);
    }

    static get asInfo() {
        return StreamList.map(stream => stream.asInfo);
    }

    constructor(fullID) {
        this.fullID = fullID;
        this.serviceID = fullID.slice(-2);
        this.userID = fullID.slice(0, -2);
        this.cooldown = new Date().getTime() + 600e3;

        this.cache = {
            customUsername: "",
            username: "",
            avatar: "",
            customURL: false,
            url: "",
            title: "",
            game: "",
            viewers: 0,
            online: false,
            notify: 7
        };

        StreamList.push(this);

        this.subscribe();
    }

    setCache(object, dispatch = true) {
        if (typeof object !== 'object') {
            return this;
        }

        let notify = false;
        for (let key in object) {
            if (this.cache.hasOwnProperty(key) && this.cache[key] !== object[key] && (typeof this.cache[key] === typeof object[key])) {
                this.cache[key] = object[key];
                
                if (key === 'online' && this.cache['online'] === true) {
                    notify = true;
                }

                if (key === 'avatar') {
                    ImageCache.getBase64(this.cache['avatar']);
                }
                continue;
            }

            delete object[key];
        }

        if (dispatch) {
            this.dispatch(object);
        }

        if (notify) {
            this.notify();
        }

        badgeThrottle.call(500);

        return this;
    }

    delete() {
        Channel.get('stream').dispatch(this.fullID, { delete: true });
        this.unsubscribe();


        let index = StreamList.indexOf(this);
        if (index > -1) {
            StreamList.splice(index, 1);
        }

        badgeThrottle.call(500);
        Stream.save();

        return index > -1;

    }

    dispatch(data) {
        if(typeof data === 'undefined' || Object.keys(data).length > 0) {
            Channel.get('stream').dispatch(this.fullID, data);
        }
        return this;
    }

    notify() {
        if(GLOBAL_MUTE || (this.cooldown > new Date().getTime())) {
            return;
        }

        if ((this.cache.notify & 1) === 1) { //audio
            AudioWrapper.get(this.fullID).play();
        }

        if ((this.cache.notify & 2) === 2) { //tab
            this.open();
        }

        if ((this.cache.notify & 4) === 4) { //desktop
            new StreamNotification(this);
        }

        this.cooldown = new Date().getTime() + 600e3;
    }

    open() {
        Browser.open(this.cache.customURL.length > 0 ? this.cache.customURL : this.cache.url);
        return this;
    }

    async subscribe() {
        //#Server;

        Server.subscribe(this);
        return this;
    }

    async unsubscribe() {
        //#Server;

        Server.unsubscribe(this);
        return this;
    }

    get toStorage() {
        return {
            fullID: this.fullID,
            cache: {
                username: this.cache.username,
                avatar: this.cache.avatar,
                notify: this.cache.notify,
                url: this.cache.url,
                customURL: this.cache.customURL,
                customUsername: this.cache.customUsername
            }
        };
    }

    get asInfo() {
        return {
            fullID: this.fullID,
            cache: this.cache
        };
    }
};

App.register('Stream', Stream);

const streamStorage = Storage.get('stream', [
    {
        fullID: "28119552tw",
        cache: {
            username: "AurelienSama",
            avatar: "https://static-cdn.jtvnw.net/jtv_user_pictures/10e4a0f9-2f82-4109-8040-120fb22a80b4-profile_image-300x300.png"
        }
    }, {
        fullID: "36305404tw",
        cache: {
            username: "ShoukaSeikyo",
            avatar: "https://static-cdn.jtvnw.net/jtv_user_pictures/0e777155-a5ac-4cfd-b0d4-8e603031a052-profile_image-300x300.png"
        }
    }
]);
for(let i in streamStorage) {
    const { fullID, cache } = streamStorage[i];
    new Stream(fullID).setCache(cache, false);
}

// new Stream('50918844tw').setCache({}, false);

Channel.get('stream')
    .subscribe('all', async () => {
        return Stream.asInfo;
    })
    .subscribe('get', ({ fullID }) => {
        return Stream.getByID(fullID).asInfo;
    })
    .subscribe('delete', ({ fullID }) => {
        return Stream.getByID(fullID).delete();
    })
    .subscribe('open', ({ fullID }) => {
        return Stream.getByID(fullID).open();
    })
    .subscribe('update', ({ fullID, cache }) => {
        Stream.getByID(fullID).setCache(cache, false);
        Stream.save();
        return true;
    })
    .subscribe('setMute', ({ mute }) => {
        GLOBAL_MUTE = mute;
        return true;
    })
    .subscribe('getMute', () => {
        return GLOBAL_MUTE;
    });