//#DynamicSheet;

const globalSheet = new DynamicSheet();
const ComponentsList = {};

const Component = class {

    /**
     * Returns a Component class.
     *
     * @param {string} name - The registered name of the Component.
     * @returns {Component}
     */
    static getByName(name) {
        return ComponentsList[name];
    }

    /**
     * Registers the Component class.
     *
     * @param {Component} component - The Component class to register.
     * @returns {Component}
     */
    static register(component) {
        if (component.prototype instanceof Component) {
            if (typeof component.rules === 'object') {
                for (const ruleName in component.rules) {
                    if (!component.rules.hasOwnProperty(ruleName)) {
                        continue;
                    }

                    globalSheet.addRule(`${ruleName.replace(/this/g, `ui-${component.name}`)} {${component.rules[ruleName]}}`);
                }
            }
        }
        return this;
    }

    /**
     * Returns the name of the Component class.
     *
     * @abstract
     * @returns {string}
     */
    static get name() {
        return 'component';
    }

    /**
     * Returns the CSS rules for the Component class.
     *
     * @abstract
     * @returns {Object}
     */
    static get rules() {
        return {};
    };

    /**
     * Returns the HTML of the Component class.
     *
     * @abstract
     * @param {Object} generatorRegistry
     * @returns {string}
     */
    static baseHTML(generatorRegistry) {
        return `<ui-component></ui-component>`;
    }

    /**
     * Returns the Element for the Component class. Creates it if it doesn't exist.
     *
     * @param {Component} component
     * @returns {Element}
     */
    static createElement(component) {
        if (!component.hasElement) {
            component.element = document.createRange().createContextualFragment(component.constructor.baseHTML(component.generatorRegistry)).children[0];
        }

        return component.element;
    }

    /**
     * Registers the events for the Component class upon creation.
     *
     * @param {Component} component
     * @returns {Component}
     */
    static setupHandlers(component) {
        component.eventHandlers.forEach(eventHandler => {
            let elements;
            if (eventHandler.selector === false) {
                elements = [component.element];
            } else {
                elements = component.element.querySelectorAll(eventHandler.selector);
            }

            elements.forEach(element => {
                let evtHandler = evt => {
                    eventHandler.handler({ component: component, handlerTarget: element, target: evt.target, domEvent: evt })
                    evt.stopPropagation();
                };
                eventHandler.eventNames.forEach(evtName => element.addEventListener(evtName, evtHandler));
            });
        });

        component.eventHandlers = [];
        return component;
    }

    constructor() {
        this.parentComponent = false;
        this.childrenComponents = new Set();
        this.element = false;
        this.addElement = false;

        this.generatorRegistry = {};
        this.dataHandlers = [];
        this.dataRegistry = {};
        this.eventHandlers = [];
    }

    /**
     * Returns the parent Component
     *
     * @returns {Component}
     */
    get parent() {
        return this.parentComponent;
    }

    /**
     * Set the parent Component
     *
     * @param {Component} component
     */
    set parent(component) {
        if (component instanceof Component) {
            this.parentComponent = component;
            this.parentComponent.childrenComponents.add(this);
        }
    }

    /**
     * Returns is the component has a parent.
     *
     * @returns {boolean}
     */
    get hasParent() {
        return this.parentComponent !== false;
    }

    /**
     * Adds a children Component.
     *
     * @param {Component} component
     * @returns {Component}
     */
    add(component) {
        component.parent = this;
        return this;
    }

    /**
     * Adds to a Component.
     *
     * @param {Component} component
     * @returns {Component}
     */
    addTo(component) {
        component.add(this);

        return this;
    }

    /**
     * Set a generator property.
     *
     * @param {string} name
     * @param {object} value
     * @returns {Component}
     */
    setProperty(name, value) {
        this.generatorRegistry[name] = value;
        return this;
    }

    /**
     * Returns the generator property.
     *
     * @param {string} name
     * @param {object} value
     * @returns {object}
     */
    getProperty(name, value = "") {
        return this.generatorRegistry.hasOwnProperty(name) ? this.generatorRegistry[name] : value;
    }

    /**
     * Adds or removes the attribute on every element.
     *
     * @param {Element|string} element
     * @param {string} name
     * @param {object} value
     * @returns {Component}
     */
    setAttribute(element, name, value = null) {
        if (value === null) {
            return this.setAttribute(this.element, element, name);
        }

        if (typeof element === 'string') {
            element = this.element.querySelectorAll(element);
        } else if (!Array.isArray(element)) {
            element = [element];
        }

        if (value) {
            element.forEach(e => e.setAttribute(name, ''));
        } else {
            element.forEach(e => e.removeAttribute(name));
        }

        return this;
    }

    /**
     * Set this component data.
     *
     * @param {string} name
     * @param {object} value
     * @returns {Component}
     */
    setData(name, value) {
        this.dataRegistry[name] = value;
        return this;
    }

    /**
     * Returns this component data.
     *
     * @param {string} name
     * @param {object} value
     * @returns {object}
     */
    getData(name, value = "") {
        return this.dataRegistry.hasOwnProperty(name) ? this.dataRegistry[name] : value;
    }

    /**
     * Removes this component data.
     *
     * @param {string} name
     * @returns {Component}
     */
    removeData(name) {
        delete this.dataRegistry[name];
        return this;
    }

    /**
     * Set the component data. If it is different, it calls the events related to this data name.
     *
     * @param {string} name
     * @param {object} value
     * @returns {Component}
     */
    updateData(name, value) {
        if (this.getData(name) !== value) {
            this.setData(name, value);
            this.dataHandlers.forEach(({ name: _name, handler }) => {
                if (name === _name) {
                    handler(value);
                }
            });
            return true;
        }

        return false;
    }

    /**
     * Returns if this component has an element created.
     *
     * @returns {boolean}
     */
    get hasElement() {
        return this.element !== false;
    }

    /**
     * Generates the element of this component.
     *
     * @param {string} pos
     * @param {Element} addElement
     * @returns {Component}
     */
    create(pos, addElement = false) {
        if(this.element !== false) {
            return this;
        }

        const parentElement = addElement !== false ? addElement : this.parentComponent === false ? document.body : this.parentComponent.element;

        parentElement.insertAdjacentElement(pos, Component.createElement(this));

        this.childrenComponents.forEach(childrenComponent => childrenComponent.getProperty('preprend', false) ? childrenComponent.prepend() : childrenComponent.append());

        Component.setupHandlers(this);
        return this;
    }

    /**
     * Generates the element of this component before the parent.
     *
     * @returns {Component}
     */
    before() {
        return this.create('beforebegin');
    }

    /**
     * Generates the element of this component after the parent.
     *
     * @returns {Component}
     */
    after() {
        return this.create('afterend');
    }

    /**
     * Generates the element of this component at the start the parent.
     *
     * @returns {Component}
     */
    append() {
        return this.create('beforeend');
    }

    /**
     * Generates the element of this component at the end the parent.
     *
     * @returns {Component}
     */
    prepend() {
        return this.create('afterbegin');
    }

    /**
     * Destroys the component and removes it from its parent.
     *
     * @returns {Component}
     */
    destroy() {
        this.parentComponent.childrenComponents.delete(this);
        if(this.element !== false) {
            this.element.remove();
            this.element = false;
        }

        return this;
    }

    /**
     * Setup an event handler for a change in data.
     *
     * @param {string} selector
     * @param {string} name
     * @param {function} handler({ element, value })
     * @returns {Component}
     */
    onData(selector, name, handler) {
        if (typeof handler === 'undefined') {
            return this.onData(false, selector, name);
        }

        this.dataHandlers.push({
            name: name,
            handler: (value) => {
                let selected;
                if (selector === null || selector === false) {
                    selected = [this.element];
                } else {
                    selected = this.element.querySelectorAll(selector);
                }
                selected.forEach(element => handler({
                    element: element,
                    value: value
                }));
            }
        });

        return this;
    }

    /**
     * Setup a DOMEventHandler.
     *
     * @param {string} selector
     * @param {Array|string} eventNames
     * @param {function} handler({ component, handlerTarget, target, domEvent })
     * @returns {Component}
     */
    onEvent(selector, eventNames, handler) {
        if (typeof handler === 'undefined') {
            return this.onEvent(false, selector, eventNames);
        }

        this.eventHandlers.push({
            selector: selector,
            eventNames: (Array.isArray(eventNames) ? eventNames : [eventNames]),
            handler: handler
        });

        return this;
    }
};

App.register('Component', Component);