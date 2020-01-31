//#Component;

const Page = class extends Component {

    static get name() {
        return 'page';
    }

    static get rules() {
        return {
            'this[visible]': `
                position: fixed;
                top: 0;
                left: 0;
                opacity: 1;
                transition: opacity .3s,top .3s;
                z-index: 10;
            `,
            'this': `
              display: block;
                position: fixed;
                height: var(--html-height);
                width: var(--html-width);
                top: var(--normal-size);
                left: -100%;
                opacity: 0;
                transition: opacity 0.3s, top 0.3s, left 0s 0.3s;
                z-index: 10;
                padding-top: 0;
                overflow-x: hidden;
                overflow-y: hidden;
            `

        };
    }

    static baseHTML({ name = '' }) {
        return `
            <ui-page name="${name}"></ui-page>
        `;
    }

    constructor() {
        super();

        this.onData('visible', ({ value }) => {
            this.setAttribute('visible', value);
        });
    }

};

Component.register(Page);
App.register('ui-component-page', Page);