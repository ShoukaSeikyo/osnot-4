//#ui-component-stream-list as StreamList,
//ui-component-stream as Stream,
//ui-component-stream-full as StreamFull,
//ui-component-stream-infos as StreamInfo,
//ui-component-scrollbar as ScrollBar,
//ArrayIterate,
//Channel,
//Throttle,
//EDITPAGE;

new StreamInfo({ edit: '/*τ(STREAM_EDIT,{ })*/' })
    .onEvent('ui-stream-info:not([info="edit"])', 'click', ({ component }) => Channel.get('stream').dispatch('open', { fullID: component.getData('fullID') }))
    .onEvent('ui-stream-info[info="edit"]', 'click', async ({ component }) => {
        EDITPAGE.updateData('stream', await Channel.get('stream').dispatch('get', { fullID: component.getData('fullID') }));
        component.setAttribute('visible', false);
        component.removeData('stream');
    })
    .append()
    .context(async streamInfo => {
        new StreamList({ perrow: await Channel.get('settings').dispatch('get', { name: 'per-row', getValue: '6' }) })
            .add(new ScrollBar())
            .append()
            .context(async streamList => {
                const appendStream = async (value, requery = false) => {
                    const { fullID, cache } = value;
                    const { avatar, online, username } = cache;

                    let streamFull = null;
                    const createFull = async () => {
                        if (!(await Channel.get('settings').dispatch('get', { name: 'full-stream', getValue: false }))) {
                            if (streamFull !== null) {
                                streamFull.destroy();
                                streamFull = null;
                            }
                            return;
                        }

                        if (streamFull !== null) {
                            return;
                        }

                        const { cache } = await Channel.get('stream').dispatch('get', { fullID: fullID });

                        streamFull = new StreamFull()
                            .onEvent('ui-stream-info', 'click', ({ component }) => Channel.get('stream').dispatch('open', { fullID: component.getData('fullID') }))
                            .onEvent('ui-avatar', 'click', async ({ component }) => EDITPAGE.updateData('stream', await Channel.get('stream').dispatch('get', { fullID: component.getData('fullID') })))
                            .onData('online', async ({ component, value }) => {
                                if (!value || !(await Channel.get('settings').dispatch('get', { name: 'full-stream', getValue: false }))) {
                                    streamFull = null;
                                    return component.destroy();
                                }
                                component.reorganize();
                            })
                            .addTo(streamList)
                            .prepend()
                            .updateData('stream', { fullID: fullID, cache: cache })
                            .reorganize();
                    };

                    new Stream({ fullID, avatar: await Channel.get('image').dispatch('get', { url: avatar }), online, username })
                        .setData('online', online)
                        .addTo(streamList)
                        .onEvent('click', async ({ component }) => {
                            const cache = await Channel.get('stream').dispatch('get', { fullID: fullID });
                            if (!component.element.hasAttribute('online')) {
                                EDITPAGE.updateData('stream', cache);
                                return;
                            }

                            streamInfo.updateData('position', { x: 12, y: component.element.getBoundingClientRect().y, width: 1 });
                            streamInfo.updateData('stream', cache);
                        })
                        .onEvent('favicon', 'click', ({ component }) => {
                            Channel.get('stream').dispatch('open', { fullID: fullID });
                        })
                        .append()
                        .context(async stream => {
                            let dead = false;
                            Channel.get('stream').subscribe(fullID, async cache => {
                                if (dead) {
                                    return;
                                }

                                if (typeof cache !== 'undefined' && typeof cache.delete === 'boolean') {
                                    stream.destroy();
                                    stream = null;
                                    if (streamFull !== null) {
                                        streamFull.destroy();
                                    }
                                    dead = true;
                                    return;
                                }

                                if (typeof cache === 'undefined' || !cache.hasOwnProperty('online')) {
                                    return;
                                }

                                if (cache.online) {
                                    createFull(cache);
                                }

                                if (streamFull !== null) {
                                    streamFull.updateData('online', cache.online);
                                }

                                stream.updateData('online', cache.online);
                                stream.reorganize();
                            });

                            // MONKEY PATCHING !!!
                            // After being compiled (production environment), the popup behaves weirdly when a stream is added.
                            if (requery) {
                                stream.updateData('online', (await Channel.get('stream').dispatch('get', { fullID: fullID })).cache.online);
                                stream.reorganize();
                            }
                        });

                    if (online) {
                        createFull(cache);
                    }
                };

                await ArrayIterate(await Channel.get('stream').dispatch('all'), async (id, stream) => await appendStream(stream));
                Channel.get('stream').subscribe('add', data => appendStream(data, true));
                document.body.setAttribute('ready', '');
            });
    });