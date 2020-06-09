//#Channel,
//ui-component-page as Page,
//ui-component-page-header as PageHeader,
//ui-component-large-button as LargeButton,
//ui-component-icon as Icon,
//ui-component-title-section as TitleSection,
//ui-component-textarea as TextArea,
//ui-component-paragraph as Paragraph;

const scanPage = new Page({ name: 'scan-page' })
    .add(new PageHeader({ pageTitle: '/*τ(SCAN_URLS,{ })*/' })
        .onEvent('ui-icon[svg="arrow-left"]', 'click', ({ root }) => root.children.textarea.element.querySelectorAll('textarea').forEach(textarea => textarea.value = '')))
    .add(new TitleSection({ text: '/*τ(DID_U_KNOW,{ })*/' }))
    .add(new Paragraph({ text: '/*τ(ALSO_SCAN_MAIN,{ })*/' }))
    .add(new TitleSection({ text: '/*τ(PASTE_URLS,{ })*/' }))
    .add(new TextArea(), 'textarea')
    .add(new LargeButton({ text: '/*τ(PROCESS_URLS,{ })*/', icon: `▶//(delete-empty)` })
        .onEvent('click', ({ root }) => {
            const { textarea, addParagraph } = root.children;

            addParagraph.element.innerHTML = "";
            textarea.element.querySelectorAll('textarea').forEach(async _textarea => {
                const urls = _textarea.value.split(/\r?\n/);
                for (let i = 0; i < urls.length; i++) {
                    if (urls[i].length < 1) {
                        continue;
                    }

                    const retrieved = await Channel.get('scanner').dispatch('handle', { url: urls[i] });
                    if (retrieved != false) {
                        Channel.get('scanner').dispatch('add', { fullID: retrieved.fullID });
                    }
                    addParagraph.element.innerHTML += `${urls[i]} <font color="${retrieved == false ? `RED">[INVALID` : `GREEN">[${retrieved.fullID}`}]</font>`;
                }

                _textarea.value = "";
            });
        }))
    .add(new TitleSection({ text: '/*τ(SCANNED_URLS,{ })*/' }))
    .add(new Paragraph(), 'addParagraph')
    .append()
    .register('SCANPAGE');