//#Component;

const Paragraph = class extends Component {

    static get name() {
        return 'paragraph';
    }

    static get rules() {
        return {
            'this': `
                display: block;
                width: calc(var(--html-width) - var(--normal-half));
                height: var(--normal-size);
                margin: 0 var(--half-size);
                padding: 0 var(--quarter-size);
                font-size: var(--quarter-size);
            `
        };
    }

    static baseHTML({ text = '' }) {
        return `
            <ui-paragraph>
                ${text.replace(/\r?\n|\r/g, '<br>')}
            </ui-paragraph>
        `;
    }

};

Component.register(Paragraph);
App.register('ui-component-paragraph', Paragraph);