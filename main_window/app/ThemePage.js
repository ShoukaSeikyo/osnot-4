//#Channel,
//ui-component-page as Page,
//ui-component-page-header as PageHeader,
//ui-component-theme-template as ThemeTemplate,
//ui-component-information as Information,
//ui-component-slider as Slider,
//ui-component-switch as Switch,
//ui-component-title-section as TitleSection;

const Themes = {
    'osnot-original': 'Original',
    'osnot-original-red': 'Original Red',
    'osnot-blue-gray': 'Blue Gray',
    'osnot-brown': 'Brown',
    'osnot-deep-purple': 'Deep Purple',
    'osnot-green': 'Green',
    'osnot-indigo': 'Indigo',
    'osnot-light-blue': 'Light Blue',
    'osnot-orange': 'Orange',
    'osnot-pink': 'Pink',
    'osnot-teal': 'Teal',
    'osnot-dark': 'Dark'
};

document.body.setAttribute('theme', await Channel.get('settings').dispatch('get', { name: 'theme', getValue: 'osnot-original' }));
document.body.setAttribute('fullmode', await Channel.get('settings').dispatch('get', { name: 'full-stream', getValue: false }));

const C2H = c => Number(c).toString(16).padStart(2, '0');
const changeIconColor = (colorIcon = false) => {
    if (colorIcon) {
        const { 1: r, 2: g, 3: b } = /rgb\(([0-9]+), ([0-9]+), ([0-9]+)\)/.exec(window.getComputedStyle(document.querySelector('ui-logo polygon')).getPropertyValue('fill'));
        Channel.get('badge').dispatch('icon', { color: `#${C2H(r)}${C2H(g)}${C2H(b)}` });
        Channel.get('settings').dispatch('set', { name: 'icon-color', setValue: `#${C2H(r)}${C2H(g)}${C2H(b)}` });
    } else {
        Channel.get('badge').dispatch('icon', { color: '#4BB0FF' });
    }
}

new Page({ name: 'theme-page' })

    .onData('setup', async ({ component, children }) => {
        component.updateData('visible', true);
        component.removeData('setup');
        children.colorIconSwitch.updateData('value', await Channel.get('settings').dispatch('get', { name: 'theme-icon', getValue: false }));
        children.fullStreamSwitch.updateData('value', await Channel.get('settings').dispatch('get', { name: 'full-stream', getValue: false }));
    })

    .add(new PageHeader({ pageTitle: '/*τ(THEMES,{ })*/' }))
    .add(new TitleSection({ text: '/*τ(INTERFACE_GLOBAL,{ })*/' }))
    .add('colorIconSwitch', new Switch({ text: '/*τ(INTERFACE_ICON,{ })*/', icon: `▶(tray)`, small: true })
        .onEvent('input', 'change', async ({ target: { checked } }) => {
            await Channel.get('settings').dispatch('set', { name: 'theme-icon', setValue: checked });
            changeIconColor(checked);
        }))
    .add('fullStreamSwitch', new Switch({ text: '/*τ(INTERFACE_FULL_STREAM,{ })*/', icon: `▶(list)`, border: true, small: true })
        .onEvent('input', 'change', async ({ target: { checked } }) => {
            await Channel.get('settings').dispatch('set', { name: 'full-stream', setValue: checked });
            window.location.reload();
        }))
    .context(themePage => {
        for (let key in Themes) {
            themePage.add(new ThemeTemplate({ name: Themes[key], themeID: key })
                .onEvent('click', async ({ component }) => {
                    const id = component.getPropertyValue('themeID');
                    await Channel.get('settings').dispatch('set', { name: 'theme', setValue: id });
                    document.body.setAttribute('theme', id);
                    changeIconColor();
                }));
        }
    })
    .append()
    .register('THEMEPAGE');