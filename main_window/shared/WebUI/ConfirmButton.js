//#Component;

const ConfirmButton = class extends Component {

    static get name() {
        return 'confirm-button';
    }

    static get rules() {
        return {
            'this': `
                --allow-delete: 100%;
                --delay: 1.5;
                display: block;
                width: calc(var(--html-width) - var(--normal-size));
                margin: var(--half-size) var(--half-size);
                padding: var(--quarter-size) 0;
                height: var(--half-size);
                vertical-align: middle;
                
                line-height: var(--half-size);
                font-weight: bold;
                text-align: center;
                overflow: hidden;
                transition: background-position-x .2s;
                
                background-size: 200% 100% !important;
                background-position-x: var(--allow-delete);
            `,
            'this:hover': `
                --allow-delete: 0%;
                cursor: pointer;
                transition: background-position-x calc(var(--delay) * 1s) linear;
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

    static baseHTML({ text = '', icon = '', delay = '1.5' }) {
        return `
            <ui-confirm-button style="--delay: ${ delay };">
                <ui-text>${ text }</ui-text>
                ${ icon }
            </ui-large-button>
        `;
    }

    constructor() {
        super();

        this.onEvent('click', ({ component, handlerTarget, domEvent }) => {
            const posValue = window.getComputedStyle(handlerTarget).getPropertyValue('background-position-x');
            if(domEvent.shiftKey || posValue === '0%' || posValue === '0px' || posValue === '0') {
                this.updateData('confirm', true);
                this.removeData('confirm');
            }
        });
    }
};

Component.register(ConfirmButton);
App.register('ui-component-confirm-button', ConfirmButton);