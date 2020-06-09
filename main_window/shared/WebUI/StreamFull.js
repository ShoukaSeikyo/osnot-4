//#Component;

const StreamFull = class extends Component {

    static get name() {
        return 'stream-full';
    }

    static get rules() {
        return {
            "this": `
                display: block;
                width: var(--html-width);
                height: var(--normal-half);
                margin: 0 0;
                vertical-align: top;
            `,
            'body:not([fullmode=true]) this': `
                display: none;
            `,
            'this:hover': `cursor: pointer;`,
            "this ui-avatar": `
                height: var(--normal-half);
                width: var(--normal-half);
                background-image: var(--avatar);
                float: left;
                background-size: 100%;
                display: block;
            `,
            "this ui-stream-info": `
                display: inline-block;
                width: calc(100% - var(--normal-half) - var(--eighth-size));
                height: var(--half-size);

                font-size: var(--quarter-size);
                padding-left: var(--eighth-size);
                line-height: var(--half-size);
                overflow: hidden;
            `,
            "this ui-stream-info svg": `
                display: inline-block;
                height: calc(var(--third-size) + var(--twelveth-size));
                width: calc(var(--third-size) + var(--twelveth-size));
                padding: var(--twentyfourth-size);
                vertical-align: bottom;
                margin-right: var(--twelveth-size);
            `,

            'this ui-stream-info[info="viewers"], this ui-stream-info[info="username"]': `
                font-size: var(--third-size);
                font-weight: bold;
            `,
            'this ui-stream-info[info="viewers"]': `
                width: calc(25% - var(--eighth-size));
                padding-right: var(--eighth-size);
                padding-left: 0;
                text-align: right;
            `,
            'this ui-stream-info[info="username"]': `
                width: calc(75% - var(--normal-2));
                padding-left: calc(var(--half-size));
                background-image: var(--favicon);
                background-size: var(--third-size);
                background-position: var(--twelveth-size) center;
                background-repeat: no-repeat;
            `,
            'this ui-stream-info[info="viewers"] svg': `
                margin-left: var(--eighth-size);
                margin-right: 0;
            `,

            'this ui-stream-info[empty]': `
                opacity: 0;
            `

        };
    }

    static baseHTML({ edit = 'Place Holder' }) {
        return `
            <ui-stream-full>
                <ui-avatar></ui-avatar>
                <ui-stream-info info="username"></ui-stream-info>
                <ui-stream-info info="viewers">▶(users)</ui-stream-info>
                <ui-stream-info hideable info="title">▶(title)</ui-stream-info>
                <ui-stream-info hideable info="game">▶(gamepad)</ui-stream-info>
            </ui-stream-full>
        `;
    }

    constructor(props) {
        super(props);

        this.onData('stream', ({ value }) => {
            const { fullID, cache } = value;

            this.setData('fullID', fullID);
            this.element.querySelector('ui-avatar').setAttribute('fullid', fullID);

            this.element.querySelector('ui-stream-info[info="username"]').setAttribute('service', fullID.slice(-2));
            this.element.querySelector('ui-stream-info[info="username"]').insertAdjacentText('afterbegin', cache.username);
            this.element.querySelector('ui-stream-info[info="viewers"]').insertAdjacentText('afterbegin', cache.viewers);

            this.element.querySelectorAll('ui-stream-info[info="title"]').forEach(e => {
                e.insertAdjacentText('beforeend', cache.title);
                this.setAttribute(e, 'empty', cache.title.length == 0);
            });

            this.element.querySelectorAll('ui-stream-info[info="game"]').forEach(e => {
                e.insertAdjacentText('beforeend', cache.game);
                this.setAttribute(e, 'empty', cache.game.length == 0);
            });
        });
    }

    reorganize() {
        const streamList = this.parent;
        const streams = Array.from(streamList.childrenComponents)
            .filter(streamB => streamB instanceof StreamFull && streamB !== this);

        for (let i = 0; i < streams.length; i++) {
            let currentUsername = streams[i].getProperty('username').toLowerCase(),
                refUsername = this.getProperty('username').toLowerCase(),
                currentUserID = streams[i].getProperty('uniqueid'),
                redUserID = this.getProperty('uniqueID');

            // if the stream has an inferior username to the current stream in the list OR if the stream has an inferior uniqueID if the usernames are the same.
            // these values should never ever happen to be equal. If they do, something really wrong is happenning.
            // Two users on a single platform cannot have the same identifier.
            if (currentUsername > refUsername || (currentUsername === refUsername && currentUserID > redUserID)) {
                return streams[i].element.insertAdjacentElement('beforebegin', this.element);
            }
        }

        if (streams.length > 0) {
            streams[streams.length - 1].element.insertAdjacentElement('beforebegin', this.element);
        } else {
            streamList.element.insertAdjacentElement('afterbegin', this.element);
        }
    }
}

Component.register(StreamFull);
App.register('ui-component-stream-full', StreamFull);