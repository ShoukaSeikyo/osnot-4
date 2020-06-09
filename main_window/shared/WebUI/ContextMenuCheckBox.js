//#Component, ui-component-context-element as ContextElement;

const ContextMenuCheckBox = class extends ContextElement {

    static get name() {
        return 'context-checkbox';
    }

    static get rules() {
        return {
            'ui-context-element ui-context-icon[checkbox] path': `display: none;`,
            'ui-context-element:not([checked]) ui-context-icon[checkbox] path:nth-child(1)': `display: inline-block;`,
            'ui-context-element[checked] ui-context-icon[checkbox] path:nth-child(2)': `display: inline-block;`
        };
    }

    static baseHTML({ separator = false, icon = '', text = 'Place Holder', checked = false }) {
        return `
            <ui-context-element ${ separator === true ? 'separator' : ''} ${checked === true ? 'checked' : ''}>
                <ui-context-icon>${ icon}</ui-context-icon>
                <ui-text>${ text}</ui-text>
                <ui-context-icon checkbox>
                    ▶(checkbox)
                </ui-context-icon>
            </ui-context-element>
        `;
    }

    constructor(props) {
        super(props);

        this.onEvent('click', ({ component }) => component.updateData('checked', !this.element.hasAttribute('checked')));
        this.onData('checked', ({ value }) => this.setAttribute('checked', value));
    }
};

Component.register(ContextMenuCheckBox);
App.register('ui-component-context-checkbox', ContextMenuCheckBox);