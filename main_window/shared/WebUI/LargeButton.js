//#Component;

const LargeButton = class extends Component {

    static get name() {
        return 'large-button';
    }

    static get rules() {
        return {
            'this': `
                display: block;
                width: calc(var(--html-width) - var(--normal-size));
                margin: 0 var(--half-size);
                padding: var(--quarter-size) 0;
                height: var(--half-size);
                vertical-align: middle;
                
                line-height: var(--half-size);
                font-weight: bold;
                text-align: center;
                overflow: hidden;
            `,

            'this *': `
                display: inline-block;
                overflow: hidden;
            `,

            'this ui-text': `
                width: calc(100% - var(--twelveth-size) - var(--normal-size));
                font-size: var(--third-size);
            `,

            'this svg': `
                height: var(--half-size);
                width: var(--half-size);
                margin-right: 0;
            `,
            'this svg path': `
                opacity: 1;
                transition: opacity 0s 0s;
            `,
            'this:hover svg path': `
                opacity: 0;
                transition: opacity 0s calc(var(--delay) * 1s);
                
            `,
            'this svg path+path': `
                opacity: 0;
            `,
            'this:hover svg path+path': `
                opacity: 1;
            `
        };
    }

    static baseHTML({ text = '', icon = '' }) {
        return `
            <ui-large-button>
                <ui-text>${ text}</ui-text>
                ${ icon}
            </ui-large-button>
        `;
    }
};

Component.register(LargeButton);
App.register('ui-component-large-button', LargeButton);