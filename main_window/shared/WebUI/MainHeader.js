//#Component;

const MainHeader = class extends Component {

    static get name() {
        return 'main-header'
    }

    static get rules() {
        return {
            "this": `
                position: fixed;
                top: 0;
                display: block;
                height: var(--normal-size);
                width: var(--html-width);
                box-shadow: 0 var(--twelveth-size) var(--twelveth-size) 0 rgba(0,0,0,0.1);
            `,
            "this *": `
                display: inline-block;
                vertical-align: top;
            `,
            "this ui-icon:hover": `
                cursor: pointer;
            `,
            "this ui-icon svg:hover": `
                height: var(--two-third-size);
                width: var(--two-third-size);
                padding: var(--sixth-size);
            `,
            "this ui-logo": `
                height: var(--normal-size);
                width: var(--normal-size);
            `,
            "this ui-title": `
                font-size: var(--half-size);
                line-height: var(--normal-size);
                height: var(--normal-size);
                padding-left: var(--twelveth-size);
                width: calc(var(--normal-8) - var(--twelveth-size));
            `,
            "this ui-logo svg": `
                height: var(--five-sixth-size);
                width: var(--five-sixth-size);
                padding: var(--twelveth-size);
            `,


            "this ui-option-overlay": `
                position: absolute;
                top: 0;
                right: 0;
            `,
            "this ui-search-bar": `
                height: var(--normal-size);
            `,
            "this ui-search-bar input": `
                font-size: var(--third-size);
                height: var(--third-size);
                padding: 0;
                padding-top: var(--third-size);
                outline: 0;
                border-radius: 0 0 0 2px;
                border: 0;
                border-bottom-width: 1px;
                border-bottom-style: solid;
                width: 0;
                transition: width .75s;
            `,
            "this ui-search-bar input[search]": `
                width: calc(var(--normal-5) - var(--sixth-size));
                padding-left: var(--sixth-size);
            `,
            "this triangle": `
                display: inline-block;
                width: 0;
                height: 0;
                border-style: solid;
                border-width: var(--normal-size) var(--normal-size) 0 0;
            `
        };
    }

    static baseHTML({ appTitle = 'Stream Notifier', searchDefault = 'Rechercher' }) {
        return `
        <ui-main-header>
            <ui-logo svg="logo">
                ▶(logo)
            </ui-logo>
            <ui-title>${appTitle}</ui-title>
            <ui-option-overlay>
                <triangle></triangle>
                <ui-search-bar>
                    <input type="text" value="${ searchDefault }">
                    <ui-icon svg="magnify">
                        ▶(magnify)
                    </ui-icon>
                </ui-search-bar>
                <ui-icon svg="gear">
                    ▶(gear)
                </ui-icon>
            </ui-option-overlay>
        </ui-main-header>
        `;
    }

    constructor() {
        super();

        this.onEvent('ui-search-bar ui-icon', 'click', ({ component }) => {
            component.element.querySelector('ui-search-bar input').toggleAttribute('search');
        });

        this.onEvent('ui-search-bar input', 'focus', ({ target }) => {
            target.value = target.value === this.getProperty('searchDefault') ? '' : target.value;
        });

        this.onEvent('ui-search-bar input', 'blur', ({ target }) => {
            target.value = target.value.length < 1 ? this.getProperty('searchDefault') : target.value;
        });

        this.onEvent('ui-search-bar input', 'input', ({ target }) => {
            this.updateData('search-value', target.value);
        });
    }
}

Component.register(MainHeader);
App.register('ui-component-main-header', MainHeader);