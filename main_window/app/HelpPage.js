//#Channel,
//ui-component-page as Page,
//ui-component-page-header as PageHeader,
//ui-component-title-section as TitleSection,
//ui-component-information as Information;

const { version } = await Channel.get('browser').dispatch('infos');

new Page({ name: 'help-page' })
    .add(new PageHeader({ pageTitle: '/*τ(HELP,{ })*/' }))
    .add(new TitleSection({ text: '/*τ(INFORMATIONS,{ })*/' }))
    .add(new Information({ text: version, icon: `▶(help-circle)`, title: '/*τ(VERSION,{ })*/' }))
    .add(new Information({ text: 'https://github.com/ShoukaSeikyo/osnot-4', icon: `▶(github)`, title: 'GitHub' }))
    .add(new TitleSection({ text: '/*τ(CONTACT,{ })*/' }))
    .add(new Information({ text: 'contact@shoukaseikyo.fr', icon: `▶(at)`, title: '/*τ(EMAIL,{ })*/' }))
    .add(new Information({ text: '@ShoukaSeikyo', icon: `▶(twitter)`, title: '/*τ(TWITTER,{ })*/' }))
    .append()
    .register('HELPPAGE');