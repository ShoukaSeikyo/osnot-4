//#Component;

const PageHeader = class extends Component {

    static get name() {
        return 'page-header'
    }

    static get rules() {
        return {
            "this": `
                display: block;
                height: var(--normal-size);
                width: var(--html-width);
                box-shadow: 0 var(--twelveth-size) var(--twelveth-size) 0 rgba(0, 0, 0, 0.1);
            `,
            "this *": `
                display: inline-block;
                vertical-align: top;
            `,
            "this ui-title": `
                font-size: var(--half-size);
                line-height: var(--normal-size);
                height: var(--normal-size);
                padding-left: var(--twelveth-size);
                width: calc(var(--normal-8) - var(--twelveth-size));
            `,
            "this ui-icon:hover": `
                cursor: pointer;
            `,
            "this ui-icon svg:hover": `
                height: var(--two-third-size);
                width: var(--two-third-size);
                padding: var(--sixth-size);
            `
        };
    }

    static baseHTML({ pageTitle = 'Place Holder' }) {
        return `
            <ui-page-header>
                <ui-icon svg="arrow-left">
                    ▶(arrow-left)
                </ui-icon>
                <ui-title>${pageTitle}</ui-page-title>
            </ui-page-header>
        `;
    }

    constructor() {
        super();

        this.onEvent('ui-icon[svg="arrow-left"]', 'click', ({ component }) => {
            component.parent.updateData('visible', false);
        });

        this.onData('ui-title', 'pageTitle', ({ element, value }) => {
            element.innerText = value;
        });
    }
}

Component.register(PageHeader);
App.register('ui-component-page-header', PageHeader);