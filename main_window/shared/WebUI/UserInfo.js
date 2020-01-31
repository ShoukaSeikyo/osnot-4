//#Component;

const UserInfo = class extends Component {

    static get name() {
        return 'user-info'
    }

    static get rules() {
        return {
            "this": `
                width: var(--html-width);
                height: var(--normal-3);  
                display: inline-block;
                vertical-align: top; 
            `,
            'this ui-avatar': `
                height: var(--normal-2);
                width: var(--normal-2);
                margin: var(--half-size);
                background-image: var(--avatar);
                float: left;
                background-size: 100%;
            `,
            'this input': `
                display: block;
                width: calc(var(--normal-6) - var(--eighth-size));
                height: var(--half-size);
                font-weight: bold;
                padding: 0;
                padding-left: var(--eighth-size);
                border: 0;
                outline: 0;
                margin: var(--quarter-size);
                background: 0;
                border-bottom-width: 1px;
                border-bottom-style: solid;
                border-radius: 0 0 2px 0;
            `,
            'this input:nth-of-type(1)': `margin-top: var(--five-sixth-size);`,
            'this input+input': `margin-bottom: var(--normal-size);`
        };
    }

    static baseHTML() {
        return `
            <ui-user-info>
                <ui-avatar></ui-avatar>
                <input name="username" type="text" spellcheck="false">
                <input name="url" type="text" spellcheck="false">
            </ui-user-info>
        `;
    }

    constructor() {
        super();

        this.onData('stream', async ({ value: { fullID, cache: { customUsername, username, url, customURL } } }) => {
            this.element.querySelector('ui-avatar').setAttribute('fullid', fullID);
            const inputs = this.element.querySelectorAll('input');
            this.setData('default_username', username);
            this.setData('default_url', url);
            inputs[0].value = customUsername.length > 0 ? customUsername : username;
            inputs[1].value = customURL.length > 0 ? customURL : url;
        });

        this.onEvent('input', 'change', ({ target }) => {
            if(target.value.length === 0) {
                target.value = this.getData(`default_${target.getAttribute('name')}`);
            }
            this.setData(target.getAttribute('name'), target.value);
        });
    }
}

Component.register(UserInfo);
App.register('ui-component-user-info', UserInfo);