//#Component;

const ContextMenuElement = class extends Component {

    static get name() {
        return 'context-element';
    }

    static get rules() {
        return {
            "this": `
                display: block;
                width: calc(100% - var(--half-size));
                margin: 0 var(--eighth-size);
                padding: var(--sixth-size) var(--eighth-size);
                height: var(--half-size);
            `,
            "this *": `
                display: inline-block;
                height: var(--half-size);
                vertical-align: top;
            `,
            "this:hover": `
                cursor: pointer;
            `,
            "this[separator]": `
                border-bottom-width: 1px;
                border-bottom-style: solid;
            `,
            "this ui-context-icon svg": `
                width: var(--third-size);
                height: var(--third-size);
                margin: var(--twelveth-size);
            `,
            "this ui-context-icon": `
                width: var(--half-size);
                height: var(--half-size);
            `,
            "this ui-text": `
                width: calc(100% - var(--normal-size) - var(--eighth-size));
                font-size: var(--quarter-size);
                line-height: var(--half-size);
                padding-left: var(--eighth-size);
            `
        };
    }

    static baseHTML({separator, icon, text}) {
        return `
            <ui-context-element ${separator === true ? 'separator' : ''}>
                <ui-context-icon>${icon}</ui-context-icon>
                <ui-text>${text}</ui-text>
            </ui-context-element>
        `;
    }

    constructor() {
        super();

        this.setProperty('separator', false);
        this.setProperty('icon', '');
        this.setProperty('text', 'Empty Element');

        this.onEvent('click', ({ component }) => {
            if(this.constructor === ContextMenuElement) {
                component.parent.updateData('visible', false);
            }
        });
    }

    

    create(pos) {
        return super.create(pos, this.parentComponent.element.querySelector('ui-context-menu'));
    }
};

Component.register(ContextMenuElement);
App.register('ui-component-context-element', ContextMenuElement);