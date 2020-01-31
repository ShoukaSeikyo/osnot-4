//#Component;

const ThemeTemplate = class extends Component {

    static get name() {
        return 'theme-template';
    }

    static get rules() {
        return {
            'this': `
                display: inline-block;
                width: calc(var(--html-width) * 0.20 - 6px);
                height: calc(var(--html-width) * 0.20 - 6px);
                margin: calc(var(--html-width) * 0.025);
                box-shadow: var(--twelveth-size) var(--twelveth-size) var(--twelveth-size) 0px rgba(0, 0, 0, 0.1);
                border-width: 3px;
                border-style: solid;
                vertical-align: top;
            `,
            'this:hover': `cursor: pointer;`,
            'this *': `
                display: inline-block;
                vertical-align: top;
            `,
            'this ui-theme-header': `
                width: var(--normal-half);
                padding-left: calc(100% - var(--normal-half));
                height: var(--half-size);
                box-shadow: 0 var(--twelveth-size) var(--twelveth-size) 0 rgba(0, 0, 0, 0.1);
            `,
            'this ui-theme-overlay': `
                width: var(--normal-size);
                height: var(--half-size);
            `,
            'this ui-theme-title': `
                width: 100%;
                height: var(--half-size);
                margin: 10px 0px;
                font-size: 12px;
                line-height: 24px;
                font-weight: bold;
                text-align: center;
                box-shadow: var(--twelveth-size) var(--twelveth-size) var(--twelveth-size) 0px rgba(0, 0, 0, 0.1);
            `,
            'this ui-theme-icon': `
                width: var(--third-size);
                height: var(--third-size);
                margin: var(--twelveth-size);
            `,
            'this ui-theme-triangle': `
                width: 0;
                height: 0;
                border-style: solid;
                border-width: var(--half-size) var(--half-size) 0 0;
            `
        };
    }

    static baseHTML({ themeID = 'default', name = 'Original' }) {
        return `
            <ui-theme-template theme="${ themeID}">
                <ui-theme-header>
                    <ui-theme-triangle></ui-theme-triangle>
                    <ui-theme-overlay>
                        <ui-theme-icon></ui-theme-icon>
                        <ui-theme-icon></ui-theme-icon>
                    </ui-theme-overlay>
                </ui-theme-header>
                <ui-theme-title>${ name}</ui-theme-title>
            </ui-theme>
        `;
    }

};

Component.register(ThemeTemplate);
App.register('ui-component-theme-template', ThemeTemplate);