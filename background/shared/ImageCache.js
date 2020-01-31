//#Channel;
let INSTANCE;

const ImageCache = class {
    constructor() {
        this.images = {};
        INSTANCE = this;
        this.getBase64('/static/blank.png');
    }

    getBase64(url) {
        return url;
    }
};

Channel.get('image')
    .subscribe('get', async ({ url }) => {
        return await INSTANCE.getBase64(url);
    });

App.register('ImageCacheBase', ImageCache);