//#Throttle, Storage, Channel, Utils as {between};
const AudioList = new Map();

const AudioWrapperBase = class {

    static get list() {
        return AudioList;
    }

    static save() {
        Storage.set('audio', Array.from(AudioList.values()).map(audio => audio.toStorage));
        Storage.save();
    }

    static get(id = 'default') {
        return AudioList.get(id) || AudioList.get('default');
    }

    static has(id = 'default') {
        return AudioList.has(id);
    }

    constructor({ id, volume, base64 }) {
        this.id = id;
        this.volume = volume;
        this.loadBase64(base64);

        this.throttle = new Throttle().setMode(Throttle.MODE.AWAIT_LAST).setCallback(async () => {
            this.stop();
        });

        AudioList.set(this.id, this);
    }

    get valid() {
        return false;
    }

    async play(volume) {
        return await this.throttle.call(this.duration);
    }

    stop() {
        this.setPos(0);
        return this;
    }

    setPos(value) {
        return this;
    }

    get duration() {
        return 5e3;
    }

    getVolume() {
        return this.volume;
    }

    setVolume(value) {
        this.volume = between(value, 0, 1);
        return this;
    }

    loadBase64(value) {
        return this;
    }

    load(file) {
        return this;
    }

    get asInfo() {
        return {
            id: this.id,
            volume: this.volume
        };
    }

    get toStorage() {
        return this.asInfo;
    }
};

Channel.get('audio')
    .subscribe('play', async ({ id = 'default', volume = -1 }) => {
        await AudioWrapper.get(id).play(volume);
        return true;
    })
    .subscribe('volume', async ({ id = 'default', volume = 1 }) => {
        AudioWrapper.get(id).setVolume(volume);
        return true;
    })
    .subscribe('info', async ({ id = 'default' }) => {
        if(AudioWrapper.has(id)) {
            return AudioWrapper.get(id).asInfo;
        }

        return false;
    })
    .subscribe('update', async (data) => {
        const { id = 'default', volume = 1, base64 = null } = data;
        if (!AudioWrapper.has(id)) {
            new AudioWrapper(data);
        } else {
            const audioWrapper = AudioWrapper.get(id);
            audioWrapper.setVolume(volume)
            if(base64 !== null) {
                audioWrapper.loadBase64(base64);
            }
        }

        AudioWrapper.save();
    });

App.register('AudioWrapperBase', AudioWrapperBase);

//#AudioWrapper;
const audioStorage = Storage.get('audio', [{
    id: 'default',
    base64: '/static/default.ogg',
    volume: 1
}]);
for(let i in audioStorage) {
    new AudioWrapper(audioStorage[i]);
}
