//#Component;

const TextArea = class extends Component {

    static get name() {
        return 'textarea';
    }

    static get rules() {
        return {
            'this': `
                display: block;
                width: calc(var(--html-width) - var(--normal-size));
                margin: var(--half-size) var(--half-size);
                margin-bottom: 0;
                padding: var(--quarter-size) 0;
                height: var(--normal-2);
            `,
            'this textarea': `
                display: block;
                width: calc(var(--html-width) - var(--normal-size) - var(--quarter-size));
                height: var(--normal-2);
                padding: var(--eighth-size);
                border: none;
                outline: none;

                resize: none;
            `
        };
    }

    static baseHTML() {
        return `
            <ui-textarea>
                <textarea></textarea>
            </ui-textarea>
        `;
    }

};

Component.register(TextArea);
App.register('ui-component-textarea', TextArea);