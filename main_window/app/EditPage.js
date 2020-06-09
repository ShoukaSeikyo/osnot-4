//#Channel,
//ui-component-page as Page,
//ui-component-page-header as PageHeader,
//ui-component-user-info as UserInfo,
//ui-component-audio-file as AudioFile,
//ui-component-switch as Switch,
//ui-component-confirm-button as ConfirmButton,
//ui-component-icon as Icon,
//ui-component-title-section as TitleSection;

new Page({ name: 'edit-page' })

    .onData('stream', async ({ component, children, value }) => {
        const { fullID, cache } = value;

        component.setData('fullID', fullID);
        children.titleSection.updateData('text', `ID [${fullID}]`);
        children.userInfo.updateData('stream', value);

        children.audioFile.updateData('audio', await Channel.get('audio').dispatch('info', { id: fullID }));

        children.sound.updateData('value', Switch.fromByte(cache.notify, 1));
        children.tab.updateData('value', Switch.fromByte(cache.notify, 2));
        children.desktop.updateData('value', Switch.fromByte(cache.notify, 4));

        component.updateData('visible', true);
    })

    .onData('visible', ({ component, value }) => {
        if (!value) {
            component.removeData('fullID');
            component.removeData('stream');
        }
    })

    .add(new PageHeader({ pageTitle: '/*τ(EDIT_STREAM,{ })*/' })
        .add(new Icon({ svg: `▶(content-save)` })
            .onEvent('click', async ({ root }) => {
                const { userInfo, audioFile, desktop, tab, sound } = root.children;
                await Channel.get('stream').dispatch('update', {
                    fullID: root.getData('fullID'),
                    cache: {
                        customUsername: userInfo.getData('username', ''),
                        customURL: userInfo.getData('url', ''),
                        notify: Switch.toByte(desktop, tab, sound)
                    }
                });

                if (audioFile.getData('base64', '') !== '') {
                    await Channel.get('audio').dispatch('update', {
                        id: root.getData('fullID'),
                        volume: audioFile.getData('volume'),
                        base64: audioFile.getData('base64')
                    });
                } else if (audioFile.getData('id') !== 'default') {
                    await Channel.get('audio').dispatch('update', {
                        id: root.getData('fullID'),
                        volume: audioFile.getData('volume')
                    });
                }

                root.updateData('visible', false);
            })))
    .add(new UserInfo(), 'userInfo')
    .add(new Switch({ text: '/*τ(NOTIFICATION_DESKTOP,{ })*/', icon: `▶(desktop)`, border: true, small: true }), 'desktop')
    .add(new Switch({ text: '/*τ(NOTIFICATION_TAB,{ })*/', icon: `▶(tab-plus)`, border: true, small: true }), 'tab')
    .add(new Switch({ text: '/*τ(NOTIFICATION_AUDIO,{ })*/', icon: `▶(music-box)`, border: true, small: true }), 'sound')
    .add('audioFile', new AudioFile({ name: 'stream-edit', text: '/*τ(NOTIFICATION_AUDIO_CUSTOM_CUE,{ })*/', disabledOnEmpty: true })
        .onData('playID', async ({ component, value }) => {
            component.setAttribute('playing', true);
            await Channel.get('audio').dispatch('play', { id: value, volume: component.getData('volume', -1) });
            component.setAttribute('playing', false);
        }))
    .add(new ConfirmButton({ text: '/*τ(DELETE_STREAM,{ })*/', icon: `▶(delete-empty)` })
        .onData('confirm', async ({ root }) => {
            await Channel.get('stream').dispatch('delete', { fullID: root.getData('fullID') });
            root.updateData('visible', false);
        }))
    .add(new TitleSection({ debug: true }), 'titleSection')
    .append()
    .register('EDITPAGE');