//#Channel,
//ui-component-page as Page,
//ui-component-page-header as PageHeader,
//ui-component-user-info as UserInfo,
//ui-component-audio-file as AudioFile,
//ui-component-switch as Switch,
//ui-component-confirm-button as ConfirmButton,
//ui-component-icon as Icon,
//ui-component-title-section as TitleSection;

new Page({ name: 'settings-page' })
    .onData('setup', async ({ component, children }) => {
        children.audioFile.updateData('audio', await Channel.get('audio').dispatch('info', { id: 'default' }));

        const notify = await Channel.get('settings').dispatch('get', { name: 'notify', getValue: 7 });

        children.sound.updateData('value', Switch.fromByte(notify, 1));
        children.tab.updateData('value', Switch.fromByte(notify, 2));
        children.desktop.updateData('value', Switch.fromByte(notify, 4));

        component.updateData('visible', true);
        component.removeData('setup');
    })
    .add(new PageHeader({ pageTitle: '/*τ(SETTINGS,{ })*/' })
        .add(new Icon({ svg: `▶(content-save)` })
            .onEvent('click', async ({ root }) => {
                const { audioFile, desktop, tab, sound } = root.children;
                await Channel.get('settings').dispatch('set', { name: 'notify', setValue: Switch.toByte(desktop, tab, sound) });

                if (audioFile.getData('base64', '') !== '') {
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
            })))
    .add(new TitleSection({ text: '/*τ(GENERAL,{ })*/' }))
    .add(new Switch({ text: '/*τ(NOTIFICATION_DESKTOP_GLOBAL,{ })*/', icon: `▶(desktop)`, border: true }), 'desktop')
    .add(new Switch({ text: '/*τ(NOTIFICATION_TAB_GLOBAL,{ })*/', icon: `▶(tab-plus)`, border: true }), 'tab')
    .add(new Switch({ text: '/*τ(NOTIFICATION_AUDIO_GLOBAL,{ })*/', icon: `▶(music-box)`, border: true }), 'sound')
    .add(new TitleSection({ text: '/*τ(NOTIFICATION_AUDIO_CUSTOM_CUE_SECTION,{ })*/' }))
    .add('audioFile', new AudioFile({ name: 'settings', text: '/*τ(NOTIFICATION_AUDIO_CUSTOM_CUE_GLOBAL,{ })*/', isDefault: true })
        .onData('playID', async ({ component, value }) => {
            component.setAttribute('playing', true);
            await Channel.get('audio').dispatch('play', { id: value, volume: component.getData('volume', -1) });
            component.setAttribute('playing', false);
        }))
    .append()
    .register('SETTINGSPAGE');