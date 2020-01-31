//#Component;

const Switch = class extends Component {

    static get name() {
        return 'switch';
    }

    static get rules() {
        return {
            'this': `
                display: block;
                width: calc(var(--html-width) - var(--normal-size));
                height: var(--normal-size);
                margin: 0 var(--half-size);
                padding: var(--quarter-size) 0;
            `,

            'this[border]': `
                border-bottom-width: 1px;
                border-bottom-style: solid;
            `,
            'this[small]': `
                height: var(--half-size);
            `,
            'this *': `
                display: inline-block;
                vertical-align: middle;
            `,
            
            'ui-switch-icon': `
                float: left;
                padding: var(--quarter-size) 0;
            `,
            'ui-switch-icon, ui-switch-icon svg': `
                width: var(--half-size);
                height: var(--half-size);
            `,
            'this[small] ui-switch-icon': `
                padding: 0;
            `,

            'this ui-text': `
                height: auto;
                line-height: var(--half-size);
                vertical-align: middle;

                width: calc(100% - var(--half-size) - var(--normal-2) - var(--quarter-size));
                padding-left: var(--quarter-size);
                font-size: var(--quarter-size);
            `,

            'this label': `
                padding: var(--quarter-size) 0;
            `,
            'this[small] label': `
                padding: 0;
            `,
            'this label, this label svg': `
                width: var(--normal-2);
                height: var(--half-size);
            `,
            'this label:hover': `
              cursor: pointer;
            `,
            'this label svg path:nth-of-type(1)': `
                opacity: 0.5;
            `,
            'this label svg path': `
                transition: transform 0.1s;
            `,
            'this label input:checked + svg path:nth-of-type(n+2)': `
                transform: translate(34.5px, 0px);
            `,

            'this input': `display: none;`
        };
    }

    static baseHTML({ icon, text, checked, border, small }) {
        return `
            <ui-switch ${ border ? 'border' : '' } ${ small ? 'small' : '' }>
                <ui-switch-icon>${icon}</ui-switch-icon>
                <ui-text>${text}</ui-text>
                <label>
                    <input ${ checked ? 'checked': '' } type="checkbox">
                    ▶(switch)
                </label>
            </ui-switch>
        `;
    }

    static toByte(...switches) {
        let output = '';
        switches.forEach(switsh => output += (switsh.getData('value') === true ? '1' : '0'));
        return parseInt(output, 2);
    };

    constructor() {
        super();

        this.onEvent('input', 'change', ({ target }) => {
            this.setData('value', target.checked);
        });

        this.onData('input', 'value', ({ element, value }) => {
            element.checked = value;
        });
    }

};

Component.register(Switch);
App.register('ui-component-switch', Switch);