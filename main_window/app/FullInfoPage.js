//#Channel,
//ui-component-page as Page,
//ui-component-page-header as PageHeader,
//ui-component-stream-infos-lite as StreamInfoLite,
//ui-component-scrollbar as ScrollBar,
//ui-component-stream-list as StreamList;

new Page({ name: 'full-stream-page' })
    .add(new PageHeader({ pageTitle: '/*τ(ONLINE_STREAMS,{ })*/' }))
    .add(new StreamList({ margin: '0px' })
        .add(new ScrollBar()), 'streamList')
    .onData('fetch', async ({ component, children: { streamList } }) => {
        streamList.clear(StreamInfoLite);
        const streams = (await Channel.get('stream').dispatch('all')).filter(({ cache: { online } }) => online);
        for (let i in streams) {
            new StreamInfoLite()
                .onEvent('ui-stream-info', 'click', ({ component }) => Channel.get('stream').dispatch('open', { fullID: component.getData('fullID') }))
                .addTo(streamList)
                .append()
                .updateData('stream', streams[i]);
        }

        component.updateData('visible', true);
        component.removeData('fetch');
    })
    .append()
    .register('FULLINFOPAGE');