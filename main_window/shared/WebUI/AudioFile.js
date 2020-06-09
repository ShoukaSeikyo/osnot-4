//#Component;

const AudioFile = class extends Component {

    static get name() {
        return 'audio-file';
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

            'this ui-audio-icon[svg="volume-high"]': `
                padding: var(--quarter-size) 0;
                float: left;
                width: var(--half-size);
                height: var(--half-size);
            `,
            'this ui-audio-icon[svg="volume-high"] svg': `
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
                --range-value: .5;
                -webkit-appearance: none;
                -moz-appearance: none;
                
                width: calc(100% - var(--normal-2) - var(--half-size) - var(--quarter-size));
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
            `,

            'this input[type="file"]': `display: none;`,

            'this label': `
                width: var(--half-size);
                height: var(--half-size);

                margin: 0 var(--eighth-size);
                margin-left: var(--half-size);

                border-radius: var(--half-size);
            `,
            'this label svg': `
                width: var(--third-size);
                height: var(--third-size);
                margin: var(--twelveth-size);
            `,

            'this ui-audio-icon[svg="play"]': `
                border-radius: var(--half-size);
                width: var(--half-size);
                height: var(--half-size);
                margin: 0 var(--eighth-size);
            `,
            'this ui-audio-icon[svg="play"] svg': `
                width: var(--third-size);
                height: var(--third-size);
                margin: var(--twelveth-size);
            `,

            'this label:hover, this ui-audio-icon:not([disabled]):hover': `cursor: pointer;`,

            'this:not([playing]) ui-audio-icon[svg="play"] path:nth-of-type(2), this[playing] ui-audio-icon[svg="play"] path:nth-of-type(1)': `display: none;`
        };
    }

    static baseHTML({ text = 'Place Holder', name = 'audio', disabled = false }) {
        return `
            <ui-audio-file>
                <ui-text>${ text}</ui-text>
                <ui-audio-icon svg="volume-high">▶(volume-high)</ui-audio-icon>
                <input ${ disabled ? 'disabled' : ''} type="range" min="0" max="1" step="0.01" value="1" style="--range-value: 1;">
                <input id="audio-file-${ name}" type="file" accept="audio/*">
                <label for="audio-file-${ name}" svg="paperclip">▶(paperclip)</label>
                <ui-audio-icon ${ disabled ? 'disabled' : ''} svg="play">▶(play)</ui-audio-icon>
            </ui-audio-file>
        `;
    };

    constructor(props) {
        super(props);

        this.testAudio = false;
        this.testTimeoutID = -1;
        this.reader = new FileReader();
        this.reader.addEventListener('load', domEvent => this.updateData('base64', domEvent.target.result));

        this.onEvent('input[type="range"]', 'input', ({ target }) => this.updateData('volume', parseFloat(target.value)));

        this.onEvent('ui-audio-icon[svg="play"]', 'click', async ({ handlerTarget }) => {
            if (!handlerTarget.hasAttribute('disabled')) {
                this.updateData('playing', !this.getData('playing', false));
            }
        });

        this.onEvent('input[type="file"]', 'change', ({ target }) => {
            if (target.files.length < 1) {
                if (this.getProperty('disableOnEmpty', false) === true) {
                    this.updateData('disabled', true)
                }
                return;
            }

            this.reader.readAsDataURL(target.files[0]);
        });

        this.onData('disabled', ({ value }) => {
            this.setAttribute('input[type="range"]', 'disabled', value);
            this.setAttribute('ui-audio-icon[svg="play"]', 'disabled', value);
        });

        const stopAudio = () => {
            this.testAudio.pause();
            this.setData('playing', false);
            this.setAttribute('playing', false);
        };

        this.onData('playing', ({ value }) => {
            if (this.getData('id', null) === null && (this.getData('base64') === null || this.testAudio === false)) {
                return;
            }

            if (this.getData('id', null) !== null) {
                this.updateData('playID', this.getData('id'));
                this.removeData('playID');
                return;
            }

            this.setAttribute('playing', this.getData('playing', false));

            if (value) {
                this.testAudio.currentTime = 0;
                this.testAudio.volume = this.getData('volume', 1);
                this.testAudio.play();

                this.testTimeoutID = setTimeout(stopAudio, Math.min(5e3, this.testAudio.duration * 1e3));
            } else {
                if (this.testTimeoutID > -1) {
                    clearTimeout(this.testTimeoutID);
                    this.testTimeoutID = -1;
                }

                stopAudio();
            }
        });

        this.onData('input[type="range"]', 'volume', ({ element, value }) => {
            if (this.testAudio !== false) {
                this.testAudio.volume = value;
            }

            element.style = `--range-value: ${value};`;
            element.value = value;
        });

        this.onData('base64', ({ value }) => {
            this.testAudio = new Audio(value);

            this.removeData('id');
            this.updateData('disabled', false);
            this.updateData('volume', 1);
        });

        this.onData('audio', ({ value: { id, volume } }) => {
            if (typeof id !== 'undefined' && (this.getProperty('isDefault', false) || id !== 'default')) {
                this.setData('id', id);
                this.updateData('volume', volume);
                this.updateData('disabled', false);
            } else {
                this.removeData('id');
                this.updateData('disabled', true);
            }

            this.testAudio = false;
            this.removeData('audio');
            this.removeData('base64');
        });
    }

};

Component.register(AudioFile);
App.register('ui-component-audio-file', AudioFile);