//#Component;

const ScrollBar = class extends Component {

    static get name() {
        return 'scrollbar';
    }

    static get rules() {
        return {
            'this': `
                --y-offset: 0;
                --scroll-height: 1;
                --height: 1;
                --percentage: calc(var(--height) / var(--scroll-height));
                --relative-height: calc(var(--percentage) * var(--height));
                --offset: calc(var(--height) - var(--relative-height));
                --progress: 0;

                position: fixed;
                z-index: 900;
                right: 0;
                --top: calc((var(--y-offset) * 1px) + (var(--progress) * var(--offset) * 1px));
                top: calc((var(--y-offset) * 1px) + ((var(--progress) * var(--offset)) * 1px));
                // bottom: calc(var(--top) + ((var(--relative-height) * 1px) - 14px));

                width: 5px;
                height: calc((var(--relative-height) * 1px) - 14px);
                background-clip: content-box;
                border-width: 3px;
                border-style: solid;
                border-color: transparent;
            `
        };
    }

    static baseHTML() {
        return `
            <ui-scrollbar></scrollbar>
        `;
    }

    onDrag(y) {
        const delta = y - this.y;
        this.y = y;
        const { scrollHeight, clientHeight } = this.parent.element;

        requestAnimationFrame(() => this.parent.element.scrollTop += (delta / (clientHeight / scrollHeight)));
    }

    stop() {
        document.removeEventListener('mousemove', this.dragListener);
        document.removeEventListener('mouseup', this.stopListener);
    }

    constructor(props) {
        super(props);

        this.y;
        this.dragListener;
        this.stopListener;

        this.onEvent('mousedown', ({ domEvent: { pageY: y } }) => {
            this.y = y;

            document.addEventListener('mousemove', this.dragListener = ({ pageY: y }) => this.onDrag(y));
            document.addEventListener('mouseup', this.stopListener = () => this.stop());
        });

        this.scrollHeight;
        this.clientHeight;
        this.scrollTop;
    }


    create(pos, addElement = false) {
        super.create(pos, addElement);
        this.parent.onEvent(['scroll', 'mouseenter'], () => this.update());
    }

    update() {
        if (!this.hasElement || !this.hasParent || !this.parent.hasElement) {
            return;
        }

        // requestAnimationFrame(() => { this.update() });

        if (this.newScrollTop !== false) {
            this.parent.element.scrollTop = this.newScrollTop;
            this.newScrollTop = false;
        }

        const yOffset = this.parent.element.getBoundingClientRect().y;
        const { scrollHeight, clientHeight, scrollTop } = this.parent.element;
        if (scrollHeight === this.scrollHeight && clientHeight === this.clientHeight && scrollTop === this.scrollTop) {
            return;
        }

        this.scrollHeight = scrollHeight;
        this.clientHeight = clientHeight;
        this.scrollTop = scrollTop;

        if (scrollHeight <= clientHeight) {
            this.element.style = `display: none;`;
        } else {
            this.element.style = `
                --y-offset: ${ yOffset};
                --scroll-height: ${ scrollHeight};
                --height: ${ clientHeight};
                --progress: ${ scrollTop / (scrollHeight - clientHeight)};
            `;
        }
    }
};

Component.register(ScrollBar);
App.register('ui-component-scrollbar', ScrollBar);