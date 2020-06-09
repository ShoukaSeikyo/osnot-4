//#Channel,
//Storage,
//ArrayIterate;

const Settings = class {

    constructor() {
        this.settings = new Map();

        this.setDefault('notify', 7);
        this.setDefault('theme', 'osnot-original');
        this.setDefault('theme-icon', false);
        this.setDefault('full-stream', false);
        this.setDefault('icon-color', '#4BB0FF');
        this.setDefault('per-row', 6);
        this.setDefault('server-url', `https://osnot.orandja.net`);
        // this.setDefault('server-url', `http://localhost:8080`);
    }

    setDefault(name, value) {
        this.settings.set(name, value);
    }

    setValue(name, value) {
        if (this.settings.has(name) && typeof this.settings.get(name) === typeof value && this.settings.get(name) !== value) {
            this.settings.set(name, value);
        }

        this.save();
        return this;
    }

    getValue(name, value) {
        if (this.settings.has(name)) {
            return this.settings.get(name);
        }
        return value;
    }

    save() {
        Storage.set('settings', this.toStorage);
        Storage.save();
    }

    get toStorage() {
        const output = {};
        this.settings.forEach((value, key) => output[key] = value);
        return output;
    }
};

let settings = new Settings();

Channel.get('settings')
    .subscribe('get', async ({ name, getValue }) => {
        return settings.getValue(name, getValue);
    })
    .subscribe('set', async ({ name, setValue }) => {
        return settings.setValue(name, setValue);
    });

await ArrayIterate(Storage.get('settings', {}), settings.setValue);
App.register('Settings', settings);