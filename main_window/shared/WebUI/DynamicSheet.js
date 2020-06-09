const DynamicSheet = class {

    constructor() {
        document.head.appendChild(this.style = document.createElement('style'));
        this.sheet = this.style.sheet;
    }

    addRule(rule) {
        try {
            this.sheet.insertRule(rule, this.sheet.cssRules.length);
        } catch (e) {
            console.log(e);
            return false;
        }

        return true;
    }

};

App.register('DynamicSheet', DynamicSheet);
