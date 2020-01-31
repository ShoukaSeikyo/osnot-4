//#Channel;

//#ui-component-page as Page, ui-component-page-header as PageHeader, ui-component-user-info as UserInfo, ui-component-audio-file as AudioFile, ui-component-switch as Switch, ui-component-confirm-button as ConfirmButton;
//#ui-component-icon as Icon, ui-component-title-section as TitleSection;
let userInfo, desktop, tab, sound, audioFile, titleSection, saveIcon;

/////////////////////
// COMPONENT SETUP //
/////////////////////

const editPage = new Page()
    .setProperty('name', 'edit-page')
.add(new PageHeader()
    .setProperty('pageTitle', /*τ(EDIT_STREAM,{ })*/)
    .add(saveIcon = new Icon()
        .setProperty('svg', `▶(content-save)`)))
.add(userInfo = new UserInfo())
.add(desktop = new Switch()
    .setProperty('text', /*τ(NOTIFICATION_DESKTOP,{ })*/)
    .setProperty('icon', `▶(desktop)`)
    .setProperty('border', true)
    .setProperty('small', true))
.add(tab = new Switch()
    .setProperty('text', /*τ(NOTIFICATION_TAB,{ })*/)
    .setProperty('icon', `▶(tab-plus)`)
    .setProperty('border', true)
    .setProperty('small', true))
.add(sound = new Switch()
    .setProperty('text', /*τ(NOTIFICATION_AUDIO,{ })*/)
    .setProperty('icon', `▶(music-box)`)
    .setProperty('border', true)
    .setProperty('small', true))
.add(audioFile = new AudioFile()
    .setProperty('name', 'stream-edit')
    .setProperty('text', /*τ(NOTIFICATION_AUDIO_CUSTOM_CUE,{ })*/)
    .setProperty('disabledOnEmpty', true))
.add(confirmButton = new ConfirmButton()
    .setProperty('text', /*τ(DELETE_STREAM,{ })*/)
    .setProperty('icon', `▶(delete-empty)`))
.add(titleSection = new TitleSection()
    .setProperty('debug', true));

//////////////////////
// COMPONENT EVENTS //
//////////////////////

audioFile
.onData('playID', async ({ value }) => {
    audioFile.setAttribute('playing', true);
    await Channel.get('audio').dispatch('play', { id: value, volume: audioFile.getData('volume', -1) });
    audioFile.setAttribute('playing', false);
});

confirmButton
.onData('confirm', async () => {
    await Channel.get('stream').dispatch('delete', { fullID: editPage.getData('fullID') });
    editPage.updateData('visible', false);
});

saveIcon
    .onEvent('click', async ({ component }) => {
        await Channel.get('stream').dispatch('update', {
            fullID: editPage.getData('fullID'),
            cache: {
                customUsername: userInfo.getData('username', ''),
                customURL: userInfo.getData('url', ''),
                notify: Switch.toByte(desktop, tab, sound)
            }
        });

        if(audioFile.getData('base64', '') !== '') {
            await Channel.get('audio').dispatch('update', {
                id: editPage.getData('fullID'),
                volume: audioFile.getData('volume'),
                base64: audioFile.getData('base64')
            });
        } else if(audioFile.getData('id') !== 'default') {
            await Channel.get('audio').dispatch('update', {
                id: editPage.getData('fullID'),
                volume: audioFile.getData('volume')
            });
        }


        editPage.updateData('visible', false);
    });

editPage
    .onData('stream', async ({ value }) => {
        const { fullID, cache } = value;
        editPage.setData('fullID', fullID);
        titleSection.updateData('text', `ID [${fullID}]`);
        userInfo.updateData('stream', value);

        audioFile.updateData('audio', await Channel.get('audio').dispatch('info', { id: fullID }));
        
        sound.updateData('value', (cache.notify & 1) === 1);
        tab.updateData('value', (cache.notify & 2) === 2);
        desktop.updateData('value', (cache.notify & 4) === 4);
        
        editPage.updateData('visible', true);
    })
    .onData('visible', ({ value }) => {
        if (!value) {
            editPage.removeData('fullID');
            editPage.removeData('stream');
        }
    });

//////////////////////
// COMPONENT APPEND //
//////////////////////

editPage.append();

App.register('EDITPAGE', editPage);