const DynamicSheet = class {
    constructor() {
        this.style = document.createElement('style');
        document.head.appendChild(this.style);
        this.sheet = this.style.sheet;
    }

    addRule(rule) {
        try {
            this.sheet.insertRule(rule, this.sheet.cssRules.length);
        } catch(e) {
            console.log(e);
            return false;
        }

        return true;
    }
};

App.register('DynamicSheet', DynamicSheet);
