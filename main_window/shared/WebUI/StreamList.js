//#Component, Throttle, ui-component-stream as Stream;

const StreamList = class extends Component {

    static get name() {
        return 'stream-list';
    }
    
    static get rules() {
        return {
            'this': `
                --per-row: 4;
                display: block;
                padding: 0 0 var(--sixth-size) 0;
                margin-top: var(--normal-size);
                height: calc(var(--html-height) - var(--normal-size));
                width: calc(var(--html-width) + 20px);
                overflow-y: scroll;
            `
        };
    }

    static baseHTML() {
        return `<ui-stream-list></ui-stream-list>`;
    }
};

Component.register(StreamList);
App.register('ui-component-stream-list', StreamList);