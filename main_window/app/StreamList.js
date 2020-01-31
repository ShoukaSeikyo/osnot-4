//#ui-component-stream-list as StreamList, ui-component-stream as Stream, ui-component-stream-infos as StreamInfo, ui-component-scrollbar as ScrollBar;
//#Channel, Throttle, EDITPAGE;

////////////////////
// GLOBAL METHODS //
////////////////////

const appendStream = async ({ fullID, cache: { avatar, online, username } }, requery = false) => {
    let stream = new Stream()
        .setProperty('fullID', fullID)
        .setProperty('avatar', await Channel.get('image').dispatch('get', { url: avatar }))
        .setProperty('online', online)
        .setData('online', online)
        .setProperty('username', username)
    .addTo(streamList);

    stream
        .onEvent('click', async ({ component }) => {
            const stream = await Channel.get('stream').dispatch('get', { fullID: fullID });
            if (!component.element.hasAttribute('online')) {
                //#EDITPAGE;
                EDITPAGE.updateData('stream', stream);
                return;
            }

            streamInfo.updateData('position', { x: 12, y: component.element.getBoundingClientRect().y, width: 1 });
            streamInfo.updateData('stream', stream);
        })
        .onEvent('favicon', 'click', ({ component }) => {
            Channel.get('stream').dispatch('open', { fullID: fullID });
        });
        
    stream.append();

    let dead = false;
    Channel.get('stream').subscribe(fullID, (cache) => {
        if (dead) {
            return;
        }

        if (typeof cache !== 'undefined' && typeof cache.delete === 'boolean') {
            stream.destroy();
            stream = null;
            dead = true;
            return;
        }

        if (typeof cache === 'undefined' || !cache.hasOwnProperty('online')) {
            return;
        }

        stream.updateData('online', cache.online);
        stream.reorganize();
    });

    // MONKEY PATCHING !!!
    // After being compiled, the popup badly updates when a stream is added.
    if(requery) {
        stream.updateData('online', (await Channel.get('stream').dispatch('get', { fullID: fullID })).cache.online);
        stream.reorganize();
    }
};

/////////////////////
// COMPONENT SETUP //
/////////////////////

const streamInfo = new StreamInfo()
.setProperty('edit', /*τ(STREAM_EDIT,{ })*/);
const streamList = new StreamList()
.add(new ScrollBar());

//////////////////////
// COMPONENT EVENTS //
//////////////////////

streamInfo
    .onEvent('ui-stream-info:not([info="edit"])', 'click', ({ component }) => {
        Channel.get('stream').dispatch('open', { fullID: component.getData('fullID') });
    })
    .onEvent('ui-stream-info[info="edit"]', 'click', async ({ component, domEvent }) => {
        const stream = await Channel.get('stream').dispatch('get', { fullID: component.getData('fullID') });
        EDITPAGE.updateData('stream', stream);

        streamInfo.setAttribute('visible', false);
        streamInfo.removeData('stream');
    });

//////////////////////
// COMPONENT APPEND //
//////////////////////

streamInfo.append();
streamList.append();

///////////////////
// CHANNEL SETUP //
///////////////////

const streams = (await Channel.get('stream').dispatch('all'));
for (let i in streams) {
    await appendStream(streams[i]);
}

streamList.element.style = `--per-row: ${ await Channel.get('settings').dispatch('get', { name: 'per-row', getValue: '6' }) };`;

Channel.get('stream').subscribe('add', data => appendStream(data, true));

document.body.setAttribute('ready', '');