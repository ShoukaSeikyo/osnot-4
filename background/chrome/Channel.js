//#ChannelBase as Channel,
//ArrayWithID;

const ports = new ArrayWithID();
const _queries = new Map();
chrome.runtime.onConnect.addListener(port => {
    if (port.name !== 'osnot-main') {
        port.disconnect();
        return;
    }

    ports.assign(port);

    const portID = ports.currentID;
    const queries = new ArrayWithID(1);
    let disconnected = false;
    _queries.set(portID, queries);

    port.onDisconnect.addListener(() => {
        ports.unassign(portID);
        _queries.delete(portID);
        disconnected = true;
    });

    port.onMessage.addListener(async ({ query, channel, mode, data }) => {
        //reverse the query ID.
        query = -query;

        //RECEIVING RESPONSE TO QUERY
        if (query > 0) {
            queries.get(query)(data);
            queries.unassign(query);
            return;
        }

        const _data = await Channel.get(channel).notify(mode, data);

        if (disconnected) {
            return;
        }

        //RESPOND TO QUERY
        port.postMessage({
            channel: channel,
            mode: mode,
            query: query,
            data: _data
        });
    });
});

const ChannelChrome = class extends Channel {

    static get list() {
        return Channel.list;
    }

    static get(name) {
        if (!Channel.has(name)) {
            return new ChannelChrome(name);
        }

        return Channel.get(name);
    }

    static has(name) {
        return Channel.has(name);
    }

    //The BackEnd should use this method to broadcast to every currently opened popup.
    async dispatch(mode, data) {
        ports.forEach(port => {
            port.postMessage({
                channel: this.name,
                mode: mode,
                data: data,
                query: 0
            });
        })
    }
};

App.register('Channel', ChannelChrome);