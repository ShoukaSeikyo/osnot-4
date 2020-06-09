//#ChannelBase as Channel, ArrayWithID;

const queries = new ArrayWithID(1);
const port = chrome.runtime.connect({ name: 'osnot-main' });
port.onMessage.addListener(async ({ query, channel, mode, data }) => {
    //reverse the query ID.
    query = -query;

    //RECEIVING RESPONSE TO QUERY
    if (query > 0) {
        queries.get(query)(data);
        queries.unassign(query);
        return;
    }

    //RESPOND TO QUERY
    Channel.get(channel).notify(mode, data);
    // port.postMessage({
    //     channel: channel,
    //     mode: mode,
    //     query: query,
    //     data: await Channel.get(channel).notify(mode, data)
    // });
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

    async dispatch(mode, data) {
        return new Promise((resolve) => {
            port.postMessage({
                channel: this.name,
                mode: mode,
                data: data,
                query: queries.assign(resolve)
            });

            setTimeout(() => {
                //Query wasn't answered.
                resolve({ error: "not answered." });
            }, 10e3);
        });
    }
};

App.register('Channel', ChannelChrome);