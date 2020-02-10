//#Component, Throttle, ui-component-stream as Stream;

const StreamList = class extends Component {

    static get name() {
        return 'stream-list';
    }
    
    static get rules() {
        return {
            'this': `
                --per-row: 4;
                --margin: var(--normal-size);
                display: block;
                padding: 0 0 var(--sixth-size) 0;
                margin-top: var(--margin);
                height: calc(var(--html-height) - var(--normal-size));
                width: calc(var(--html-width) + 20px);
                overflow-y: scroll;
            `
        };
    }

    static baseHTML({ margin = 'var(--normal-size)' }) {
        return `<ui-stream-list style="--margin: ${margin};"></ui-stream-list>`;
    }
};

Component.register(StreamList);
App.register('ui-component-stream-list', StreamList);