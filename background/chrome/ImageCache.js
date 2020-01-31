//#ImageCacheBase as ImageCache;

const ChromeImageCache = class extends ImageCache {
    async getBase64(url) {
        url = typeof url !== 'string' ? '/static/blank.png' : url;

        if (this.images.hasOwnProperty(url)) {
            return this.images[url];
        }

        try {
            const reader = new FileReader();
            reader.readAsDataURL(await (await fetch(url)).blob());
            return await new Promise(resolve => {
                reader.onload = () => resolve(this.images[url] = reader.result);
                reader.onerror = () => this.getBase64('/static/blank.png').then(data => resolve(data));
            });
        } catch (e) {
            return await this.getBase64('/static/blank.png');
        }
    }
};

App.register('ImageCache', new ChromeImageCache());