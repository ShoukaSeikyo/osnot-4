//#Stream, Throttle, Settings;

const ServerPool = class {

    constructor() {
        this.streams = new Set();
        this.eventSource = null;

        this.startThrottle = new Throttle().setMode(Throttle.MODE.FIRST).setCallback(() => {
            this.createConnection();
        });
    }

    get size() {
        return this.streams.size;
    }

    add(stream) {
        if(this.size < 20) {
            this.streams.add(stream);
            this.restart();
        }
        
        return this;
    }

    has(stream) {
        return this.streams.has(stream);
    }

    remove(stream) {
        if(this.has(stream)) {
            this.streams.delete(stream);
            this.restart();
        }

        return this;
    }

    get onlyID() {
        return Array.from(this.streams).map(stream => stream.fullID);
    }

    createConnection() {
        this.kill();
        this.eventSource = new EventSource(`${Server.URL}/stream/?id[]=${this.onlyID.join('&id[]=')}`);

        this.eventSource.addEventListener('message', ({data}) => {
            const { fullID, cache } = JSON.parse(data);
            Stream.getByID(fullID).setCache(cache);
        });
        
        // this.eventSource.addEventListener('connected', (event) => {});
        // this.eventSource.addEventListener('open', () => {});

        this.eventSource.addEventListener('error', event => this.restart());
    }

    kill() {
        if(this.isAlive) {
            this.eventSource.close();
            this.eventSource = null;
        }
    }

    get isAlive() {
        return this.eventSource !== null;
    }

    restart() {
        this.startThrottle.call(this.isAlive ? 30e3 : 1e3);
        this.kill();

        return this;
    }
};

let MaximumPools = 3;
const Server = class {

    static get URL() {
        return Settings.getValue('server-url');
    }

    constructor() {
        this.pools = [];
        for(let i = 0; i < MaximumPools; i++) {
            this.pools.push(new ServerPool());
        }
    }

    subscribe(stream) {
        this.getAvailable().add(stream);
        return this;
    }

    unsubscribe(stream) {
        this.pools.forEach(pool => pool.remove(stream));
        return this;
    }

    getAvailable() {
        return this.pools.reduce((a, b) => a.size < b.size ? a : b);
    }
};

Server.maxPerPool = 10;

App.register('Server', new Server());