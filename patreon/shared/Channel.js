const ChannelList = [];
const Channel = class {
  static get list() {
    return ChannelList;
  }

  static get(name) {
    if(!Channel.has(name)) {
      return new Channel(name);
    }

    return ChannelList.find(channel => channel.name === name);
  }

  static has(name) {
    return ChannelList.find(channel => channel.name === name) !== undefined;
  }

  constructor(name) {
    this.name = name;
    this.subscribers = [];

    ChannelList.push(this);
  }

  subscribe(mode, subscriber) {
      this.subscribers.push({
          mode: mode,
          subscriber: subscriber
      });

      return this;
  }

  async notify(_mode, data) {
      for (let i = 0; i < this.subscribers.length; i++) {
          const { mode, subscriber } = this.subscribers[i];
          if (mode === _mode) {
              return await subscriber(data);
          }
      }
  }

  async dispatch(mode, data) {
    console.info(`shouldn't be called`)
  }
};

App.register('ChannelBase', Channel);