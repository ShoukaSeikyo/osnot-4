//#Channel;

//#ui-component-page as Page, ui-component-page-header as PageHeader, ui-component-stream-infos-lite as StreamInfoLite, ui-component-scrollbar as ScrollBar, ui-component-stream-list as StreamList;

const streamList = new StreamList()
.setProperty('margin', '0px')
.add(new ScrollBar());

const fullInfoPage = new Page()
    .setProperty('name', 'full-stream-page')
.add(new PageHeader()
    .setProperty('pageTitle', /*τ(ONLINE_STREAMS,{ })*/))
.add(streamList);

//////////////////////
// COMPONENT EVENTS //
//////////////////////

fullInfoPage
    .onData('fetch', async () => {
        streamList.clear(StreamInfoLite);
        const streams = (await Channel.get('stream').dispatch('all')).filter(({ cache: { online } }) => online);
        for (let i in streams) {
            new StreamInfoLite()
                .onEvent('ui-stream-info', 'click', ({ component }) => {
                    Channel.get('stream').dispatch('open', { fullID: component.getData('fullID') });
                })
                .addTo(streamList)
                .append()
                .updateData('stream', streams[i]);
        }
        
        fullInfoPage.updateData('visible', true);
        fullInfoPage.removeData('fetch');
    });

//////////////////////
// COMPONENT APPEND //
//////////////////////

fullInfoPage.append();

App.register('FULLINFOPAGE', fullInfoPage);