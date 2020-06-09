//#ui-component-main-header as MainHeader,
//ui-component-context-menu as ContextMenu,
//ui-component-context-element as ContextElement,
//ui-component-context-checkbox as ContextCheckBox,
//ui-component-snackbar as SnackBar,
//ui-component-snackbar-text as SnackBarText,
//ui-component-snackbar-button as SnackBarButton,
//ui-component-stream as Stream,
//Channel,
//SETTINGSPAGE,
//HELPPAGE,
//THEMEPAGE,
//FULLINFOPAGE,
//SCANPAGE;

const parameters = new ContextMenu()
    .add(new ContextElement({ text: '/*τ(SCAN_URLS,{ })*/', icon: `▶(contain)` })
        .onEvent('click', () => SCANPAGE.updateData('visible', true)))
    .add(
        new ContextElement({ text: '/*τ(SETTINGS,{ })*/', icon: `▶(settings)` })
            .onEvent('click', () => SETTINGSPAGE.updateData('setup', true)))
    .add(
        new ContextElement({ text: '/*τ(THEMES,{ })*/', icon: `▶(palette)` })
            .onEvent('click', () => THEMEPAGE.updateData('setup', true)))
    .add(
        new ContextElement({ text: '/*τ(HELP,{ })*/', icon: `▶(help-circle)`, separator: true })
            .onEvent('click', () => HELPPAGE.updateData('visible', true)))
    .add(
        new ContextCheckBox({ text: '/*τ(MUTE_NOTIFICATIONS,{ })*/', icon: `▶(volume-off)`, checked: await Channel.get('stream').dispatch('getMute'), separator: true })
            .onData('checked', ({ element }) => Channel.get('stream').dispatch('setMute', { mute: element.hasAttribute('checked') })))
    .add(
        new ContextElement({ text: 'uTip', icon: `▶(coffee-outline)` })
            .onEvent('click', () => Channel.get('browser').dispatch('open', { url: 'https://www.utip.io/shoukaseikyo' })))
    .append();

let snackBarTimeout = -1;

const snackBar = new SnackBar()
    .add(new SnackBarText({ width: 75 }), 'username')
    .add(new SnackBarButton({ text: '/*τ(ADD,{ })*/', width: 25 })
        .onEvent('click', ({ root }) => {
            Channel.get('scanner').dispatch('add', { fullID: root.getData('fullID') });
            root.updateData('visible', false);
            clearTimeout(snackBarTimeout);
            snackBarTimeout = -1;
        }))
    .onData('visible', ({ component, value }) => {
        if (value) {
            snackBarTimeout = setTimeout(async () => {
                component.setAttribute('visible', false);
                Channel.get('scanner').dispatch('ignore', { fullID: component.getData('fullID') });
                snackBarTimeout = -1;
            }, 10e3);
            return;
        }

        component.removeData('fullID');
    })
    .append();

new MainHeader({ appTitle: 'Stream Notifier', searchDefault: '/*τ(SEARCH,{ })*/' })
    .onEvent('ui-icon[svg="gear"]', 'click', () => {
        parameters.updateData('position', { x: 100, y: 0, width: 1 });
        parameters.updateData('visible', !parameters.getData('visible', false));
    })
    .onData('search-value', ({ value }) => {
        if (value.length > 0) {
            Array.from(Stream.list).filter(stream => {
                if (stream.getProperty('username').toLowerCase().indexOf(value.toLowerCase()) === -1) {
                    return true;
                }

                stream.setAttribute('hidden', false);
                return false;
            }).forEach(stream => stream.setAttribute('hidden', true));

            return;
        }

        Array.from(Stream.list).forEach(stream => stream.setAttribute('hidden', false));
    })
    .append();

(async (showAdd) => {
    Channel.get('scanner').subscribe('retrieved', showAdd)
    showAdd(await Channel.get('scanner').dispatch('first'));
})(async (data) => {
    if (data === false || typeof data === 'undefined') {
        return;
    }

    const { fullID, cache: { username } } = data;
    snackBar.children.username.updateData('text', username);
    snackBar.updateData('fullID', fullID);
    snackBar.updateData('visible', true);
});