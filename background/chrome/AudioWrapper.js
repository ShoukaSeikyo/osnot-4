//#AudioWrapperBase as AudioWrapper,
//Throttle;

const chromeBackgroundURL = 'chrome-extension://ccmkbegdpiakgojificdjdbfcfnepdgl/_generated_background_page.html';

const ChromeAudioWrapper = class extends AudioWrapper {
    static get list() {
        return AudioWrapper.list;
    }

    constructor(params) {
        super(params);
    }

    get valid() {
        return typeof this.audio === 'object';
    }

    async play(volume) {
        this.stop();
        if (this.valid) {
            this.audio.volume = volume >= 0 ? volume : this.volume;
            this.audio.play();
        }

        return await super.play();
    }

    stop() {
        if (this.valid && this.audio.currentTime > 0) {
            this.audio.pause();
            this.audio.volume = this.volume;
        }

        return super.stop();
    }

    setPos(value) {
        if (this.valid) {
            this.audio.currentTime = value;
        }
        return super.setPos(value);
    }

    get duration() {
        return !this.valid ? 5e3 : Math.min(this.audio.duration * 1000, 5e3);
    }

    setVolume(value) {
        super.setVolume(value);
        if (this.valid) {
            this.audio.volume = this.volume;
        }

        return this;
    }

    loadBase64(value) {
        return this.load(value);
    }

    load(file) {
        if (file !== null && file !== chromeBackgroundURL) {
            this.audio = new Audio(file);
            this.audio.volume = this.volume;
            this.audio.loop = false;
        }

        return this;
    }

    get toStorage() {
        return Object.assign(super.toStorage, {
            base64: this.audio.src
        });
    }
}

App.register('AudioWrapper', ChromeAudioWrapper);