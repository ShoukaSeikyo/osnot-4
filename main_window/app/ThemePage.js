//#Channel;
//#ui-component-page as Page, ui-component-page-header as PageHeader, ui-component-theme-template as ThemeTemplate, ui-component-information as Information;

/////////////////////
// COMPONENT SETUP //
/////////////////////

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
    // 'osnot-dark': 'Dark'
};
const selectedTheme = await Channel.get('settings').dispatch('get', { name: 'theme', getValue: 'osnot-original' });

document.body.setAttribute('theme', selectedTheme);

const themePage = new Page()
    .setProperty('name', 'theme-page')
.add(new PageHeader()
    .setProperty('pageTitle', /*τ(THEMES,{ })*/));

for(let key in Themes) {
    const id = key;
    themePage.add(new ThemeTemplate()
    .setProperty('name', Themes[id])
    .setProperty('themeID', id)
    .onEvent('click', async ({ component }) => {
        await Channel.get('settings').dispatch('set', { name: 'theme', setValue: id });
        document.body.setAttribute('theme', id);
    }));
}


//////////////////////
// COMPONENT EVENTS //
//////////////////////

themePage
.onData('setup', async () => {
    themePage.updateData('visible', true);
    themePage.removeData('setup');
});

//////////////////////
// COMPONENT APPEND //
//////////////////////
//at
//twitter

themePage.append();

App.register('THEMEPAGE', themePage);