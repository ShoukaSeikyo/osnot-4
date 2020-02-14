//#Channel;
//#ui-component-page as Page, ui-component-page-header as PageHeader, ui-component-title-section as TitleSection, ui-component-information as Information;

/////////////////////
// COMPONENT SETUP //
/////////////////////

const BrowserInfo = await Channel.get('browser').dispatch('infos');

const helpPage = new Page()
    .setProperty('name', 'help-page')
.add(new PageHeader()
    .setProperty('pageTitle', /*τ(HELP,{ })*/))
.add(new TitleSection()
    .setProperty('text', /*τ(INFORMATIONS,{ })*/))
.add(new Information()
    .setProperty('text', BrowserInfo.version)
    .setProperty('icon', `▶(help-circle)`)
    .setProperty('title', /*τ(VERSION,{ })*/))
.add(new Information()
    .setProperty('text', 'https://github.com/ShoukaSeikyo/osnot-4')
    .setProperty('icon', `▶(github)`)
    .setProperty('title', 'GitHub'))
.add(new TitleSection()
    .setProperty('text', /*τ(CONTACT,{ })*/))
.add(new Information()
    .setProperty('text', 'contact@shoukaseikyo.fr')
    .setProperty('icon', `▶(at)`)
    .setProperty('title', /*τ(EMAIL,{ })*/))
.add(new Information()
    .setProperty('text', '@ShoukaSeikyo')
    .setProperty('icon', `▶(twitter)`)
    .setProperty('title', /*τ(TWITTER,{ })*/))

//////////////////////
// COMPONENT APPEND //
//////////////////////
//at
//twitter

helpPage.append();

App.register('HELPPAGE', helpPage);