//#Component, DynamicSheet;

const avatarSheet = new DynamicSheet();

const StreamList = new Set();
const Stream = class extends Component {

    static get list() {
        return StreamList;
    }

    static get name() {
        return 'stream';
    }

    static get rules() {
        return {
            'this': `
                display: inline-block;
                --width: calc(var(--html-width) / var(--per-row));
                height: var(--normal-half);
                width: var(--normal-half);
                height: var(--width);
                width: var(--width);
                padding: 0;
                /*margin: calc(((var(--html-width) / 5) - var(--normal-half)) / 2);*/
                /*margin-top: var(--sixth-size);*/
                transition: background-color .5s,opacity .3s .2s,filter .25s,margin .2s;            
                opacity: 1;
                /*box-shadow: var(--twelveth-size) var(--twelveth-size) var(--twelveth-size) 0 rgba(0,0,0,0.1);*/
            `,
            'this:hover': `cursor: pointer;`,
            'this ui-avatar': `
                display: block;
                height: var(--normal-half);
                width: var(--normal-half);
                height: var(--width);
                width: var(--width);
                background-size: var(--normal-half) var(--normal-half);
                background-size: var(--width) var(--width);
                background-image: var(--avatar), url("/static/blank.png");
                margin-top: calc(-1 * var(--width));
            `,
            'this:not([online]):hover ui-avatar, this:hover ui-avatar': `
                filter: grayscale(0%);
                opacity: 1;
            `,
            'this:not([online]) ui-avatar': `
                filter: grayscale(100%);
                opacity: .5;
            `,
            'this favicon': `
                position: relative;
                z-index: 1;
                /*margin: calc(var(--normal-half) - var(--third-size)) 0 0 calc(var(--normal-half) - var(--third-size));
                margin: calc(var(--width) - var(--third-size)) 0 0 calc(var(--width) - var(--third-size));*/
                
                margin: calc(var(--width) - var(--half-size)) 0 0 calc(var(--width) - var(--half-size));
                height: var(--half-size);
                width: var(--half-size);
                display: block;
                background-size: var(--third-size);
                background-image: var(--favicon);
                background-position: center center;
                background-repeat: no-repeat;
                /*box-shadow: var(--twelveth-size) var(--twelveth-size) var(--twelveth-size) 0 rgba(0, 0, 0, 0.1);*/
                
                background-color: rgba(50, 50, 50, 0.25) !important;
            `,
            '[service="dm"]': `--favicon: url(http://static1.dmcdn.net/images/neon/favicons/android-icon-36x36.png);`,
            '[service="mx"]': `--favicon: url(https://mixer.com/_latest/assets/favicons/favicon-32x32.png);`,
            '[service="pi"]': `--favicon: url(https://picarto.tv/favicon.ico);`,
            '[service="sc"]': `--favicon: url(https://smashcast.tv/favicon.ico);`,
            '[service="tw"]': `--favicon: url(https://www.twitch.tv/favicon.ico);`,
            '[service="yt"]': `--favicon: url(https://www.youtube.com/yts/img/favicon_48-vflVjB_Qk.png);`
        };
    }

    static baseHTML({fullID, online, avatar}) {
        avatarSheet.addRule(`[fullid="${fullID}"] { --avatar: url(${avatar}); }`);
        return `
            <ui-stream fullid="${fullID}" ${online ? 'online' : ''}>
                <favicon service="${fullID.slice(-2)}"></favicon>
                <ui-avatar></ui-avatar>
            </ui-stream>
        `;
    }

    constructor() {
        super();

        this.onData('online', ({ value }) => this.setAttribute('online', value));

        this.onData('remove', () => {
            StreamList.delete(this);
            this.element.remove();
        });

        StreamList.add(this);
    }

    create(pos, addElement) {
        super.create(pos, addElement);

        this.reorganize();

        return this;
    }

    reorganize() {
        const streamList = this.parent;
        const streams = Array.from(streamList.childrenComponents)
        .filter(streamB => streamB instanceof Stream && streamB !== this && streamB.getData('online', false) === this.getData('online', false));

        for (let i = 0; i < streams.length; i++) {
            let cU = streams[i].getProperty('username').toLowerCase(),
                aU = this.getProperty('username').toLowerCase(),
                cI = streams[i].getProperty('uniqueid'),
                aI = this.getProperty('uniqueID');

            // if the stream has an inferior username to the current stream in the list OR if the stream has an inferior uniqueID if the usernames are the same.
            // these values should never ever happen to be equal. If they do, something really wrong is happenning.
            if (cU > aU || (cU === aU && cI > aI)) {
                return streams[i].element.insertAdjacentElement('beforebegin', this.element);
            }
        }

        if (streams.length > 0) {
            streams[streams.length - 1].element.insertAdjacentElement('afterend', this.element);
        } else {
            streamList.element.insertAdjacentElement(this.getData('online', false) ? 'afterbegin' : 'beforeend', this.element);
        }
    }
};

Component.register(Stream);
App.register('ui-component-stream', Stream);