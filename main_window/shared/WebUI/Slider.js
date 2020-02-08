//#Component;

const Slider = class extends Component {

    static get name() {
        return 'slider';
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
            'this *': `
                display: inline-block;
                vertical-align: middle;
            `,

            'this ui-slider-icon': `
                padding: var(--quarter-size) 0;
                float: left;
                width: var(--half-size);
                height: var(--half-size);
            `,
            'this ui-slider-icon svg': `
                width: var(--half-size);
                height: var(--half-size);
            `,
            'this ui-text': `
                width: calc(100% - var(--half-size) - var(--normal-2) - var(--quarter-size));
                height: auto;

                line-height: var(--half-size);
                font-size: var(--quarter-size);
                padding-left: var(--quarter-size);
            `,

            'this input[type="range"]': `
                --range-min: 0;
                --range-max: 1;
                --range-value: .5;
                -webkit-appearance: none;
                -moz-appearance: none;
                
                width: calc(100% - var(--half-size) - var(--quarter-size));
                height: var(--twentyfourth-size);

                margin: 0;
                margin-left: var(--quarter-size);
                border: 0;
                outline: 0;
            `,
            'this input[type="range"]::-webkit-slider-thumb': `
                -webkit-appearance: none;
                -moz-appearance: none;
                width: var(--quarter-size);
                height: var(--quarter-size);
                border-radius: var(--quarter-size);
            `
        };
    }

    static baseHTML({ text = 'Place Holder', icon = '', disabled = false, min = 0.3, max = 1 }) {
        return `
            <ui-slider>
                <ui-text>${ text }</ui-text>
                <ui-slider-icon>${ icon }</ui-slider-icon>
                <input ${ disabled ? 'disabled' : ''} type="range" min="${ min }" max="${ max }" step="0.01" value="1" style="--range-value: 1;">
            </ui-slider>
        `;
    };

    constructor() {
        super();
        this.onEvent('input[type="range"]', 'input', ({ target }) => {
            this.updateData('value', parseFloat(target.value));
        });

        this.onData('disabled', ({ value }) => {
            this.setAttribute('input[type="range"]', 'disabled', value);
        });

        this.onData('input[type="range"]', 'value', ({ element, value }) => {
            const min = this.getProperty('min', 0.3);
            const pos = (value - min) / (this.getProperty('max', 1) - min);
            element.style = `--range-value: ${ pos };`;
            element.value = value;
        });
    }

};

Component.register(Slider);
App.register('ui-component-slider', Slider);