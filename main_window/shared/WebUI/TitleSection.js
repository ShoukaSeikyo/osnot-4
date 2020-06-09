//#Component;

const TitleSection = class extends Component {

    static get name() {
        return 'title-section';
    }

    static get rules() {
        return {
            'this': `
                display: block;
                padding: var(--half-size);
                padding-bottom: var(--quarter-size);
                font-size: var(--third-size);
                line-height: var(--third-size);
            `,
            'this[debug]': `
                user-select: text;
            `
        };
    }

    static baseHTML({ text = '', debug = false }) {
        return `
            <ui-title-section ${ debug ? 'debug' : ''}>${text}</ui-title-section>
        `;
    }

    constructor(props) {
        super(props);
        this.onData('text', ({ element, value }) => element.innerText = value);
    }
};

Component.register(TitleSection);
App.register('ui-component-title-section', TitleSection);