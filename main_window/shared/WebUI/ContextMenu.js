//#Component;

const ContextMenu = class extends Component {

    static get name() {
        return 'context-menu';
    }

    static get rules() {
        return {
            "ui-context-menu-space:not([visible])": `
                left: 0;
                top: 0;
                right: 100%;
                bottom: 100%;
                opacity: 0;
            `,
            "ui-context-menu-space": `
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

                top: calc((var(--top) * 1%) + var(--normal-2));
                left: calc((var(--left) * 1%) - (var(--width) * var(--normal-5)));

                z-index: 1001;
                width: var(--normal-5);
                min-height: 10px;
                border-radius: var(--twentyfourth-size);
                border-style: solid;
                border-width: 1px;
                box-shadow: 1px 1px 5px 0px rgba(0, 0, 0, 0.3);
                padding: 3px 0px;

                transition: top 0s 0.3s;
            `,

            "ui-context-menu-space[visible] this": `
                top: calc((var(--top) * 1%));
                display: block;
                transition: top 0.3s;
            `

        };
    }

    static baseHTML() {
        return `
            <ui-context-menu-space>
                <ui-context-menu></ui-context-menu>
            </ui-context-menu-space>
        `;
    }

    constructor() {
        super();
        this.addElement = 'ui-context-menu';

        this.onData('visible', ({ element, value }) => {
            if (value) {
                element.setAttribute('visible', '');
            } else {
                element.removeAttribute('visible');
            }
        });

        this.onData('ui-context-menu', 'position', ({ element, value: { x, y, width = 0 } }) => {
            element.setAttribute('style', ` --left: ${x}; --top: ${y}; --width: ${width};`);
        });

        this.onEvent('click', ({ domEvent }) => {
            if (domEvent.path[0] === this.element) {
                this.updateData('visible', false);
            }
        });
    }
};

Component.register(ContextMenu);
App.register('ui-component-context-menu', ContextMenu);