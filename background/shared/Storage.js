//#Channel;

const StorageNode = class {
    constructor(name, value = {}) {
        this.name = name;
        this.isNode = typeof value === 'object';
        this.parent = null;

        if (this.isNode) {
            this.children = new Map();
            for (let key in value) {
                this.createChild(key, value[key]);
            }
        } else {
            this.nodeValue = value;
        }

    }

    get hasParent() {
        return this.parent !== null;
    }

    setParent(node) {
        this.parent = node;
        return this;
    }

    get toNode() {
        return `${this.hasParent ? this.parent.toNode + '.' : ''}${this.name}`;
    }

    get toDebug() {
        return `${this.toNode} = ${this.isNode ? Array.from(this.children.keys()).join(', ') : this.nodeValue}`;
    }

    createChild(name, value = {}) {
        this.children.set(name, new StorageNode(name, value).setParent(this));

        return this;
    }

    popNode(node) {
        const nodes = Array.isArray(node) ? node : node.split('.');

        return {
            first: nodes.shift(),
            nodes: nodes
        };
    }

    has(node) {
        const { nodes, first } = this.popNode(node);

        if (nodes.length < 1) {
            return this.children.has(first);
        }

        if (this.children.has(first)) {
            return this.children.get(first).has(nodes);
        }

        return false;
    }

    get(node, getValue) {
        if (!this.isNode) {
            return this.nodeValue;
        }

        const { nodes, first } = this.popNode(node);

        if (this.has(first)) {
            if (nodes.length === 0) {
                return this.children.get(first).toStorage;
            } else {
                return this.children.get(first).get(nodes, getValue);
            }
        }

        return getValue;
    }

    set(node, setValue) {
        if (node.length === 0) {
            this.isNode = false;
            this.nodeValue = setValue;

            return this;
        }

        const { nodes, first } = this.popNode(node);
        if (!this.has(first)) {
            if (nodes.length === 0) {
                this.createChild(first, setValue);
            } else {
                this.createChild(first);
                this.children.get(first).set(nodes, setValue);
            }
        } else {
            this.children.get(first).set(nodes, setValue);
        }

        return this;
    }

    get toStorage() {
        if (!this.isNode) {
            return this.nodeValue;
        }

        const values = {};
        this.children.forEach((value, key) => {
            values[key] = value.toStorage;
        });

        return values;
    }
};

let INSTANCE;
const Storage = class {
    constructor(mainNode = {}) {
        INSTANCE = this;
        this.mainNode = new StorageNode('mainNode', mainNode);
    }

    has(node) {
        return this.mainNode.has(node);
    }

    set(node, setValue) {
        this.mainNode.set(node, setValue);
        return this;
    }

    get(node, getValue) {
        return this.mainNode.get(node, getValue);
    }

    save() {
        return this;
    }
};

Channel.get('storage')
    .subscribe('has', async ({ node }) => {
        return INSTANCE.has(node);
    })
    .subscribe('get', async ({ node, getValue }) => {
        return INSTANCE.get(node, getValue);
    })
    .subscribe('set', async ({ node, setValue }) => {
        return INSTANCE.set(node, setValue);
    });



App.register('StorageBase', Storage);
