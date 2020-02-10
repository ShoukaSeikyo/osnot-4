//#Component;

const StreamInfoLite = class extends Component {

    static get name() {
        return 'stream-infos-lite';
    }

    static get rules() {
        return {
            "this": `
                display: block;
                width: calc(var(--html-width) - var(--half-size));
                height: var(--normal-half);
                margin: 0 var(--quarter-size);
                margin-top: var(--twelveth-size);
                vertical-align: top;
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
            <ui-stream-infos-lite>
                <ui-avatar></ui-avatar>
                <ui-stream-info info="username"></ui-stream-info>
                <ui-stream-info info="viewers">▶(users)</ui-stream-info>
                <ui-stream-info hideable info="title">▶(title)</ui-stream-info>
                <ui-stream-info hideable info="game">▶(gamepad)</ui-stream-info>
            </ui-stream-infos>
        `;
    }

    constructor() {
        super();

        this.onData('stream', ({ value }) => {
            const { fullID, cache } = value;

            this.setData('fullID', fullID);
            this.element.querySelector('ui-avatar').setAttribute('fullid', fullID);

            this.element.querySelector('ui-stream-info[info="username"]').setAttribute('service', fullID.slice(-2));
            this.element.querySelector('ui-stream-info[info="username"]').insertAdjacentText('afterbegin', cache.username);
            this.element.querySelector('ui-stream-info[info="viewers"]').insertAdjacentText('afterbegin', cache.viewers);

            this.element.querySelectorAll('ui-stream-info[info="title"]').forEach(e => {
                e.insertAdjacentText('beforeend', cache.title);
                if(cache.title.length > 0) {
                    this.setAttribute(e, 'empty', false);
                }
            });

            this.element.querySelectorAll('ui-stream-info[info="game"]').forEach(e => {
                e.insertAdjacentText('beforeend', cache.game);
                if(cache.game.length > 0) {
                    this.setAttribute(e, 'empty', false);
                }
            });
        });
    }
}

Component.register(StreamInfoLite);
App.register('ui-component-stream-infos-lite', StreamInfoLite);