//#Channel;

//#ui-component-page as Page, ui-component-page-header as PageHeader, ui-component-user-info as UserInfo, ui-component-audio-file as AudioFile, ui-component-switch as Switch, ui-component-confirm-button as ConfirmButton;
//#ui-component-icon as Icon, ui-component-title-section as TitleSection;
let userInfo, desktop, tab, sound, audioFile, titleSection, saveIcon;

/////////////////////
// COMPONENT SETUP //
/////////////////////

const settingsPage = new Page()
    .setProperty('name', 'settings-page')
.add(new PageHeader()
    .setProperty('pageTitle', /*τ(SETTINGS,{ })*/)
    .add(saveIcon = new Icon()
        .setProperty('svg', `▶(content-save)`)))

.add(new TitleSection()
    .setProperty('text', /*τ(GENERAL,{ })*/))
.add(desktop = new Switch()
    .setProperty('text', /*τ(NOTIFICATION_DESKTOP_GLOBAL,{ })*/)
    .setProperty('icon', `▶(desktop)`)
    .setProperty('border', true))
.add(tab = new Switch()
    .setProperty('text', /*τ(NOTIFICATION_TAB_GLOBAL,{ })*/)
    .setProperty('icon', `▶(tab-plus)`)
    .setProperty('border', true))
.add(sound = new Switch()
    .setProperty('text', /*τ(NOTIFICATION_AUDIO_GLOBAL,{ })*/)
    .setProperty('icon', `▶(music-box)`)
    .setProperty('border', true))
.add(new TitleSection()
    .setProperty('text', /*τ(NOTIFICATION_AUDIO_CUSTOM_CUE_SECTION,{ })*/))
.add(audioFile = new AudioFile()
    .setProperty('name', 'settings')
    .setProperty('text', /*τ(NOTIFICATION_AUDIO_CUSTOM_CUE_GLOBAL,{ })*/)
    .setProperty('isDefault', true));
// .add(new TitleSection()
//     .setProperty('text', 'Remise à Zéro'))
// .add(confirmButton = new ConfirmButton()
//     .setProperty('text', 'Reset.')
//     .setProperty('icon', `▶//(delete-empty)`)
//     .setProperty('delay', '10'));

//////////////////////
// COMPONENT EVENTS //
//////////////////////

audioFile
.onData('playID', async ({ value }) => {
    audioFile.setAttribute('playing', true);
    await Channel.get('audio').dispatch('play', { id: value, volume: audioFile.getData('volume', -1) });
    audioFile.setAttribute('playing', false);
});

saveIcon
.onEvent('click', async ({ component }) => {
    await Channel.get('settings').dispatch('set', { name: 'notify', setValue: Switch.toByte(desktop, tab, sound) });

    if(audioFile.getData('base64', '') !== '') {
        await Channel.get('audio').dispatch('update', {
            id: 'default',
            volume: audioFile.getData('volume'),
            base64: audioFile.getData('base64')
        });
    } else {
        await Channel.get('audio').dispatch('update', {
            id: 'default',
            volume: audioFile.getData('volume')
        });
    }

    settingsPage.updateData('visible', false);
});

settingsPage
.onData('setup', async ({ value }) => {
    audioFile.updateData('audio', await Channel.get('audio').dispatch('info', { id: 'default' }));
    
    const notify = await Channel.get('settings').dispatch('get', { name: 'notify', getValue: 7 });

    sound.updateData('value', (notify & 1) === 1);
    tab.updateData('value', (notify & 2) === 2);
    desktop.updateData('value', (notify & 4) === 4);

    settingsPage.updateData('visible', true);
    settingsPage.removeData('setup');
});

//////////////////////
// COMPONENT APPEND //
//////////////////////

settingsPage.append();

App.register('SETTINGSPAGE', settingsPage);