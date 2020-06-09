//#Component;

const Icon = class extends Component {

    static get name() {
        return 'icon';
    }

    static get rules() {
        return {
            "this": `
                height: var(--normal-size);
                width: var(--normal-size);
            `,
            "this svg": `
                height: var(--half-size);
                width: var(--half-size);
                padding: var(--quarter-size);
            `
        };
    }

    static baseHTML({ svg = '' }) {
        return `
            <ui-icon>${ svg}</ui-icon>
        `;
    }
};

Component.register(Icon);
App.register('ui-component-icon', Icon);