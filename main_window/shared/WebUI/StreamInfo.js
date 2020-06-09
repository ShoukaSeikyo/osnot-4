//#Component;

const StreamInfo = class extends Component {

    static get name() {
        return 'stream-infos'
    }

    static get rules() {
        return {
            "ui-stream-info-space:not([visible])": `
                left: 0;
                top: 0;
                right: 100%;
                bottom: 100%;
                opacity: 0;
            `,
            "ui-stream-info-space": `
                display: block;
                position: fixed;
                left: 0;
                top: 0;
                right: 0;
                bottom: 0;
                z-index: 1000;
                opacity: 1;
                transition: opacity .3s;
            `,
            "this": `
                display: none;
                position: fixed;

                top: calc((var(--top) * 1px) + var(--normal-1));
                left: calc(var(--left) * 1px);

                z-index: 1001;
                width: calc(var(--html-width) - var(--half-size));
                height: var(--normal-2);
                vertical-align: top;

                box-shadow: 1px 1px 5px 0px rgba(0, 0, 0, 0.3);

                transition: top 0s 0.3s;
                border-radius: var(--twelveth-size);

                box-shadow: var(--twelveth-size) var(--twelveth-size) var(--twelveth-size) 0 rgba(0,0,0,0.1);
            `,
            'this:hover': `cursor: pointer;`,
            "this ui-avatar": `
                height: var(--normal-2);
                width: var(--normal-2);
                background-image: var(--avatar);
                float: left;
                background-size: 100%;
                display: block;
            `,
            "this ui-stream-info": `
                display: inline-block;
                width: calc(100% - var(--normal-2) - var(--eighth-size));
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
                width: calc(75% - var(--normal-2) - var(--half-size));
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

            'this ui-stream-info[info="edit"]': `
                text-align: center;
                width: calc(100% - var(--normal-2) - var(--eighth-size) - var(--third-size) - var(--sixth-size));
                padding-right: calc(var(--third-size) + var(--sixth-size));
                height: calc(var(--half-size) - 1px);
            `,
            'this ui-stream-info[empty]': `
                opacity: 0;
            `,

            "ui-stream-info-space[visible] this": `
                top: calc((var(--top) * 1px) + var(--eighth-size));
                display: block;
                transition: top 0.3s;
            `

        };
    }

    static baseHTML({ edit = 'Place Holder' }) {
        return `
            <ui-stream-info-space>
                <ui-stream-infos>
                    <ui-avatar></ui-avatar>
                    <ui-stream-info info="username"></ui-stream-info>
                    <ui-stream-info info="viewers">▶(users)</ui-stream-info>
                    <ui-stream-info hideable info="title">▶(title)</ui-stream-info>
                    <ui-stream-info hideable info="game">▶(gamepad)</ui-stream-info>
                    <ui-stream-info info="edit">▶(pencil)${ edit}</ui-stream-info>
                </ui-stream-infos>
            </ui-stream-info-space>
        `;
    }

    constructor(props) {
        super(props);
        this.addElement = 'ui-stream-info';

        this.onData('stream', ({ value }) => {
            const { fullID, cache } = value;

            this.setData('fullID', fullID);
            this.element.querySelector('ui-avatar').setAttribute('fullid', fullID);
            this.element.querySelectorAll('ui-stream-info:not([info="edit"])').forEach(e => {
                if (e.hasAttribute('hideable')) {
                    this.setAttribute(e, 'empty', true);
                }

                e.childNodes.forEach(c => {
                    if (c.nodeType === 3) {
                        c.remove();
                    }
                })
            });

            this.element.querySelector('ui-stream-info[info="username"]').setAttribute('service', fullID.slice(-2));
            this.element.querySelector('ui-stream-info[info="username"]').insertAdjacentText('afterbegin', cache.username);
            this.element.querySelector('ui-stream-info[info="viewers"]').insertAdjacentText('afterbegin', cache.viewers);

            this.element.querySelectorAll('ui-stream-info[info="title"]').forEach(e => {
                e.insertAdjacentText('beforeend', cache.title);
                if (cache.title.length > 0) {
                    this.setAttribute(e, 'empty', false);
                }
            });
            this.element.querySelectorAll('ui-stream-info[info="game"]').forEach(e => {
                e.insertAdjacentText('beforeend', cache.game);
                if (cache.game.length > 0) {
                    this.setAttribute(e, 'empty', false);
                }
            });

            this.element.setAttribute('visible', '');
        });

        this.onData('ui-stream-infos', 'position', ({ element, value: { x, y, width = 0 } }) => {
            element.setAttribute('style', ` --left: ${x}; --top: ${y}; --width: ${width};`);
        });

        this.onEvent('click', ({ domEvent }) => {
            const path = domEvent.path || (domEvent.composedPath && domEvent.composedPath());
            if (path[0] === this.element) {
                this.element.removeAttribute('visible');
                this.removeData('stream');
            }
        });
    }
}

Component.register(StreamInfo);
App.register('ui-component-stream-infos', StreamInfo);