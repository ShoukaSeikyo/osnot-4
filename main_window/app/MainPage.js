//#ui-component-main-header as MainHeader, ui-component-context-menu as ContextMenu, ui-component-context-element as ContextElement, ui-component-context-checkbox as ContextCheckBox;
//#ui-component-snackbar as SnackBar, ui-component-snackbar-text as SnackBarText, ui-component-snackbar-button as SnackBarButton, ui-component-stream as Stream;
//#//ui-component-hide-overlay as HideOverlay;
//#Channel, SETTINGSPAGE, HELPPAGE, THEMEPAGE;

let parameters, snackBar, usernameText, addButton, muteAll, mainHeader, settings, themes, help, snackBarTimeout = -1;

/////////////////////
// COMPONENT SETUP //
/////////////////////

parameters = new ContextMenu()
    .add(settings = new ContextElement()
        .setProperty('text', /*τ(SETTINGS,{ })*/)
        .setProperty('icon', `▶(settings)`))
    .add(themes = new ContextElement()
        .setProperty('text', /*τ(THEMES,{ })*/)
        .setProperty('icon', `▶(palette)`))
    .add(help = new ContextElement()
        .setProperty('text', /*τ(HELP,{ })*/)
        .setProperty('icon', `▶(help-circle)`)
        .setProperty('separator', true))
    .add(muteAll = new ContextCheckBox()
        .setProperty('text', /*τ(MUTE_NOTIFICATIONS,{ })*/)
        .setProperty('icon', `▶(volume-off)`)
        .setProperty('checked', await Channel.get('stream').dispatch('getMute')));

snackBar = new SnackBar()
    .add(usernameText = new SnackBarText()
        .setProperty('width', '75'))
    .add(addButton = new SnackBarButton()
        .setProperty('text', /*τ(ADD,{ })*/)
        .setProperty('width', '25'));

mainHeader = new MainHeader()
    .setProperty('appTitle', 'Stream Notifier')
    .setProperty('searchDefault', /*τ(SEARCH,{ })*/);

//////////////////////
// COMPONENT EVENTS //
//////////////////////

settings
.onEvent('click', () => {
    SETTINGSPAGE.updateData('setup', true);
});

help
.onEvent('click', () => {
    HELPPAGE.updateData('visible', true);
});

themes
.onEvent('click', () => {
    THEMEPAGE.updateData('setup', true);
});

muteAll
.onData('checked', ({ element }) => {
    Channel.get('stream').dispatch('setMute', { mute: element.hasAttribute('checked') });
});

snackBar
.onData('visible', ({ value }) => {
    if(value) {
        snackBarTimeout = setTimeout(async () => {
            snackBar.setAttribute('visible', false);
            Channel.get('scanner').dispatch('ignore', { fullID: snackBar.getData('fullID') });
        }, 10e3);
        return;
    }

    snackBar.removeData('fullID');
});

addButton
.onEvent('click', () => {
    Channel.get('scanner').dispatch('add', { fullID: snackBar.getData('fullID') });
    snackBar.updateData('visible', false);
    clearTimeout(snackBarTimeout);
    snackBarTimeout = -1;
});

mainHeader
.onEvent('ui-icon[svg="gear"]', 'click', ({ component, event }) => {
    parameters.updateData('position', {x: 100, y: 0, width: 1});
    parameters.updateData('visible', !parameters.getData('visible', false));
})
.onData('search-value', ({ value }) => {
    if(value.length > 0) {
        Array.from(Stream.list).filter(stream => {
            if(stream.getProperty('username').toLowerCase().indexOf(value.toLowerCase()) === -1) {
                return true;
            }

            stream.setAttribute('hidden', false);
            return false;
        }).forEach(stream => {
            stream.setAttribute('hidden', true);
        });

        return;
    }

    Array.from(Stream.list).forEach(stream => {
        stream.setAttribute('hidden', false);
    });
});

//////////////////////
// COMPONENT APPEND //
//////////////////////

parameters.append();
snackBar.append();
mainHeader.append();

///////////////////
// CHANNEL SETUP //
///////////////////

const showAdd = async (data) => {
    if(data === false || typeof data === 'undefined') {
        return;
    }
    
    const { fullID, cache } = data;
    usernameText.updateData('text', cache.username);
    snackBar.updateData('fullID', fullID);
    snackBar.updateData('visible', true);
};

Channel.get('scanner')
    .subscribe('retrieved', showAdd)
showAdd(await Channel.get('scanner').dispatch('first'));