//#Channel;

let INSTANCE;

const Badge = class {

    constructor() {
        INSTANCE = this;
    }

    color(value) { }

    text(value) {
        return typeof value === 'undefined' || value === null || value == 0 ? '' : String(value).toString();
    }

    icon(value) { }
};

const colorRegex = /([a-f0-9]{6}|[a-f0-9]{3})/i;
Channel.get('badge')
    .subscribe('color', async ({ color }) => {
        if(colorRegex.test(color)) {
            INSTANCE.color(color);
            return true;
        }

        return false;
    })
    .subscribe('icon', async ({ color }) => {
        if(colorRegex.test(color)) {
            INSTANCE.icon(color);
            return true;
        }

        return false;
    });

App.register('BadgeBase', Badge);