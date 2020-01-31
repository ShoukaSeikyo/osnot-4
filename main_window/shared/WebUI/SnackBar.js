//#Component;

const SnackBar = class extends Component {

    static get name() {
        return 'snackbar';
    }

    static get rules() {
        return {
            'this': `
                display: block;
                position: fixed;
                top: 100%;
                left: 0;
                z-index: 2000;
                height: var(--normal-size);
                width: var(--html-width);
                opacity: 0;
                transition: opacity .3s,top .3s;
            `,
            'this *': `
                display: inline-block;
                vertical-align: top;
            `,
            'this[visible]': `
                top: calc(100% - var(--normal-size));
                opacity: 1;
            `
        };
    }

    static baseHTML() {
        return `<ui-snackbar></ui-snackbar>`;
    }

    constructor() {
        super();

        this.onData('visible', ({ value }) => {
            this.setAttribute('visible', value);
        });
    }
};

const SnackBarText = class extends Component {

    static get name() {
        return 'snackbar-text';
    }

    static get rules() {
        return {
            'this': `
                --width: 100%;
                display: inline-block;
                width: calc(var(--width) - var(--normal-size));
                font-size: var(--third-size);
                line-height: var(--normal-size);
                height: var(--normal-size);
                padding: 0 var(--half-size);
            `
        };
    }

    static baseHTML({ text = '', width = '100' }) {
        return `<ui-snackbar-text style="--width: ${ width }%;">${ text }</ui-snackbar-text>`;
    }

    constructor() {
        super();

        this.onData('text', ({ element, value }) => {
            element.innerText = value;
        });
    }

};

const SnackBarButton = class extends Component {

    static get name() {
        return 'snackbar-button';
    }

    static get rules() {
        return {
            'this': `
                --width: 100%;
                display: inline-block;
                width: calc(var(--width) - var(--half-size) - 2px);
                font-size: var(--third-size);
                line-height: calc(var(--normal-size) - var(--quarter-size) - 2px);
                height: calc(var(--normal-size) - var(--quarter-size) - 2px);
                padding: 0 var(--eighth-size);
                margin: var(--eighth-size);
                border: solid 1px transparent;
                border-radius: var(--twelveth-size);
                text-align: center;
            `,
            'this:hover': `
                cursor: pointer;
            `
        };
    }

    static baseHTML({ text = '', width = '100' }) {
        return `<ui-snackbar-button style="--width: ${ width }%;">${ text }</ui-snackbar-button>`;
    }

};

Component.register(SnackBar);
App.register('ui-component-snackbar', SnackBar);
Component.register(SnackBarText);
App.register('ui-component-snackbar-text', SnackBarText);
Component.register(SnackBarButton);
App.register('ui-component-snackbar-button', SnackBarButton);