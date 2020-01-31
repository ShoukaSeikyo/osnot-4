//#Channel;
//#ui-component-page as Page, ui-component-page-header as PageHeader, ui-component-title-section as TitleSection, ui-component-paragraph as Paragraph;
//#ui-component-snackbar as SnackBar, ui-component-snackbar-text as SnackBarText, ui-component-snackbar-button as SnackBarButton;
/////////////////////
// COMPONENT SETUP //
/////////////////////

let addButton, premium;
const snackBar = new SnackBar()
    .add(new SnackBarText()
        .setProperty('width', '75')
        .setProperty('text', 'Connect with Patreon'))
    .add(addButton = new SnackBarButton()
        .setProperty('text', 'Connect')
        .setProperty('width', '25'));

const patreonPage = new Page()
    .setProperty('name', 'patreon-page')
.add(new PageHeader()
    .setProperty('pageTitle', 'Log in with Patreon'))
.add(new TitleSection()
    .setProperty('text', "En construction"))
.add(premium = new TitleSection()
    .setProperty('text', "Premium: ?"));

patreonPage.onData('visible', async ({ value }) => {
    snackBar.updateData('visible', value);

    const isPremium = await Channel.get('patreon').dispatch('premium');
    premium.updateData('text', `Premium: ${ isPremium ? "YES" : "NO" }`)
});

addButton.onEvent('click', () => {
    Channel.get('patreon').dispatch('open');
});

//////////////////////
// COMPONENT APPEND //
//////////////////////
//at
//twitter

patreonPage.append();
snackBar.append();

App.register('PATREONPAGE', patreonPage);