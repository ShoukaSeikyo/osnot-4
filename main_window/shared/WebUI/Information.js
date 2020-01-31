//#Component;

const Information = class extends Component {

    static get name() {
        return 'information';
    }

    static get rules() {
        return {
            'this:not(:last-of-type)': `
                border-bottom-width: 1px;
                border-bottom-style: solid;
            `,
            'this': `
                display: block;
                width: calc(var(--html-width) - var(--normal-size));
                height: var(--normal-size);
                margin: 0 var(--half-size);
                padding: var(--quarter-size) 0;
            `,
            'this *': `
                display: inline-block;
                vertical-align: middle;
            `,
            'this ui-icon': `
                float: left;
            `,
            'this ui-text': `
                height: var(--half-size);
                line-height: var(--half-size);
                width: calc(100% - var(--half-size) - var(--normal-2) - var(--quarter-size));
                padding-left: var(--quarter-size);
                font-size: var(--quarter-size);
                font-weight: bold;
                user-select: auto;
            `
        };
    }

    static baseHTML({ icon = '', title = '', text = ''}) {
        return `
            <ui-information>
                <ui-icon>${icon}</ui-icon>
                <ui-text>${title}</ui-text>
                <ui-text>${text}</ui-text>
            </ui-information>
        `;
    }

};

Component.register(Information);
App.register('ui-component-information', Information);