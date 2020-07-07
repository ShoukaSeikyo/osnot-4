//#Channel,
//Storage,
//ArrayIterate;

const Settings = class {

    constructor() {
        this.settingsMap = new Map();

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
        this.settingsMap.set(name, value);
    }

    setValue(name, value) {
        if (this.settingsMap.has(name) && (typeof this.settingsMap.get(name) === typeof value) && this.settingsMap.get(name) !== value) {
            this.settingsMap.set(name, value);
        }

        this.save();
        return this;
    }

    getValue(name, value) {
        if (this.settingsMap.has(name)) {
            return this.settingsMap.get(name);
        }
        return value;
    }

    save() {
        Storage.set('settings', this.toStorage);
        Storage.save();
    }

    get toStorage() {
        const output = {};
        this.settingsMap.forEach((value, key) => output[key] = value);
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

await ArrayIterate(Storage.get('settings', {}), (key, value) => settings.setValue(key, value));
App.register('Settings', settings);