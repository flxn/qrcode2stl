export default {
  //
  //  Local name of the language
  //
  languageLocalName: 'Čeština',

  //
  // General
  //
  title: 'Generátor 3D Kódů',
  subtitle: 'Exportování QR kódů nebo Spotify kódů v STL formátu pro 3D tisk',
  preview: 'Náhled',
  controlsHint: 'Použijte myš pro otáčení objektu',
  changeLanguage: 'Změna jazyka',
  contributeTranslation: 'Přispějte překladem',
  generateButton: 'Generovat 3D Model',
  scrollDownForGuide: 'Návod na tisk QR kódů níže.',
  printabilityWarning: 'Varování tisknutelnosti',
  printabilityWarningBody: 'Nejméně jedna hrana nejmenšího prvku ve 3D modelu je příliš malá: {dimensions}. V závislosti na Vašem nastavení by toto udělalo tisk obtížnější.',
  supportMe: 'Podpořte qrcode2stl',
  viewOnGithub: 'GitHub',
  shareButtonTitle: 'Sdílet tuto stránku',
  file: 'soubor',
  no: 'ne',
  yes: 'ano',
  top: 'shora',
  bottom: 'zdola',
  left: 'zleva',
  right: 'zprava',
  content: 'obsah',
  min: 'min',
  max: 'max',
  thankYou: 'Velice Vám děkuji za podporu. Jste úžasní!',
  promotionTitle: 'Chteli byste začít s novým koníčkem? Nebo sháníte druhou/třetí tiskárnu?',
  promotionSubtitle: 'Zde je pár doporučení na 3D tiskárny a doplňky. Pokud byste chtěli podpořit tento projekt, zvažte použití odkazů na AliExpress.',
  corner: 'roh',
  isGenerating: 'Vytváření 3D Modelu',
  headerShareNotice: 'Sdílejte Váš kód s pomocí této URL adresy',

  //
  // QR Code Options Panel
  //
  qrCodeOptionsTitle: 'Nastavení QR kódu',
  qrCodeTextPlaceholder: 'Váš text, který by měl QR kód obsahovat. Například Hello World nebo https://flxn.de.',
  errorCorrection: 'Míra opravy chyb',
  errorCorrectionHelp: 'Čím větší je míra opravy chyb, tím věští QR kód bude.',
  optionalFieldsHint: 'Ne všechny pole musí být vyplněny.',
  // Wifi
  ssidPlaceholder: 'Název Wi-Fi sítě',
  password: 'Heslo',
  passwordPlaceholder: 'Heslo Wi-Fi sítě',
  security: 'Zabezpečení',
  hidden: 'Zkrytá',
  hiddenText: 'SSID je zkrytá',
  // Contact
  contact: 'Kontakt',
  yourName: 'Vaše jméno',
  firstname: 'Jméno',
  lastname: 'Příjmení',
  organization: 'Organizace',
  role: 'Pozice',
  numbers: 'Čísla',
  cellphone: 'Mobil',
  phone: 'Telefon',
  street: 'Ulice',
  city: 'Město',
  state: 'Stát',
  // E-Mail
  recipient: 'Příjemce',
  recipientPlaceholder: 'Adresa příjemce, který by měl e-mail přijmout',
  subject: 'Předmět',
  subjectPlaceholder: 'Předmět e-mailu',
  body: 'Zpráva',
  bodyPlaceholder: 'Obsah e-mailu',
  // SMS
  phonePlaceholder: 'Telefonní číslo příjemce',
  smsMessage: 'Zpráva',
  smsMessagePlaceholder: 'Obsah SMS zprávy',
  // Calendar
  calendar: 'Kalendář',
  eventName: 'Název události',
  eventNamePlaceholder: 'Název události',
  startDate: 'Datum začátku',
  startTime: 'Čas začátku',
  endDate: 'Datum konce',
  endTime: 'Čas konce',
  allDay: 'Celý den',
  allDayEvent: 'Celodenní událost',
  location: 'Místo',
  locationPlaceholder: 'Místo konání události (volitelné)',
  description: 'Popis',
  descriptionPlaceholder: 'Popis události (volitelné)',

  //
  // Spotify Options Panel
  //
  spotifyOptions: 'Nastavení Spotify kódu',
  spotifyUri: 'Spotify URI/Odkaz',
  spotifyUriHelp: 'URI nahrávky/alba/playlistu/uživatele získáte ze Spotify kliknutím na "Sdílet" a poté "URI".',
  spotifyCodeHeightInfo: 'Kód Spotify má neupravitelý poměr stran 4:1',

  //
  // 3D Model Options Panel
  //
  modelOptions: 'Možnosti 3D Modelu',
  base: 'Základna',
  width: 'Šířka',
  height: 'Výška',
  depth: 'Hloubka',
  cornerRadius: 'Radius hran',
  border: 'Hrana',
  borderAroundBase: 'Přidat ohraničení okolo základny',
  margin: 'Okraj',
  block: 'Blok',
  style: 'Styl',
  shape: 'Tvar',
  rectangle: 'obdélník',
  roundedRectangle: 'zaoblený obdélník',
  square: 'čtverec',
  round: 'zaoblení',
  size: 'Velikost',
  blockSizeHelp: `
  Upravuje velikost jednotlivých částí QR kódu.
  Pohrajte si s tímto nastavením, můžete docílit unikátního vzhledu, ovšem mějte na paměti, že můžete zhoršit čitelnost kódu.\\
  Vždy po úpravě hodnoty zkontrolujte, zda je kód čitelný, abyste předešli zbytečnému tisku. Ke kontrole můžete použít aplikaci na mobilním telefonu.
  Pokud si nejte jisti, nechte hodnotu na 100 %.
  Při změně hodnoty nad 100 % (například na 120 %) bude tisk jednodušší, jelikož jednotivé body kódu budou propojeny.`,
  icon: 'Ikona',
  noIcon: 'Žádná ikona',
  iconSizeHelp: `
  Velikost ikony je relativní k šířce QR kódu.
  Ikona využívá opravu chyb QR kódu. V případě, že by byla ikona příliš velká a/nebo míra opravy chyb příliš malá, kód by nemusel být čitelný.
  If you want to have a big icon but your phone can't read the QR code you can try to increase the Error Correction Level.`,
  text: 'Text',
  textOnEdge: 'Přidat vlastní nadpis QR kódu',
  placement: 'Umístění',
  theText: 'Normální text\n*Text s kurzívou*\n**Tučný text**\n***Tučný text s kurzívou***',
  fontInfoText: 'Změna stylu písma pro každý řádek:',
  italicInfoText: '*kurzíva*',
  boldInfoText: '**tučně**',
  cityMode: 'QR-City',
  cityModeText: 'Náhodně vyvýší jednotlivé části kódu.',
  invert: 'Invertovat',
  invertText: 'Invertuje strukturu kódu',
  keychain: 'Klíčenka',
  keychainHelp: 'Přidat očko na stranu tagu (Například k přidělání na klíčenku).',
  mirrorHoles: 'Zrcadlit očka',
  mirrorHolesHelp: 'Zrcadlit očka na protější stranu (Například k zavěšení na zeď pomocí vrutů.).',
  keychainHoleDiameter: 'Průměr očka',
  nfcIndentation: 'NFC/RFID',
  nfcIndentationHelp: 'Přidá zespodu prohlubeň pro vložení NFC/RFID tagu.',
  indentation: 'Prohlubeň',
  nfcIndentationHiddenHelp: 'Vytvoří prostor uvnitř objektu, který bude minimálně jeden milimetr zespodu. Díky tomu je možno vložit tag přímo do objektu. Před vrstvou, která uzavírá prostor uvnitř objektu pozastavte tisk a poté opět tisk spusťte. Vždy vytvořte prostor lehce větší, než je samotný tag. Mějte na paměti, že velikost základny musí být vždy větší, než velikost samotného prostoru.',

  //
  // Export Settings
  //
  exportTypeHelp: 'Ponechte na "binary" pro zachování nízké velikosti objektu. V případě, že objekt obsahuje chyby, zkuste změňte toto nastavení.',
  exportSeparatePartsHelp: 'Pokud nastaveno na "Ano", pak je základna a kód uloženy jako dva soubory. Využijte toto nastavení pro dual extrusion. Pravděpodobně budete prohlížečem dotázáni na povolení stáhnutí více souborů.',
  separateParts: 'Oddělit části',
  saveAsButton: 'Stáhnout STL',

  //
  // Print Guide
  // with HTML Tags included!
  //
  printGuideTitle: 'Průvodce 3D Tiskem',
  printGuideSubtitle: 'Jak vytisknout dvoubarevný QR kód s pomocí jednobarevné tiskárny? (S jedním extruderem.)',
  printGuideWIPInfo: 'This guide is a work in progress.',
  printGuideIntro: `
  Pokud máte tiskárnu s jedním extruderem, je také možno tisknout více barvami. Bude potřeba vyměnit filament po dokončení požadované vrstvy.<br/>
  Tímto způsobem můžeme vytisknout základnu jednou barvou a samotný QR kód barvou druhou.<br/>
  Díky tomuto bude kód možné přečíst, jelikož jednobarevný kód by byl nečitelný.<br/>
  Tento porces se liší od Sliceru ke Sliceru.<br/>
  V tomto návodu se budme soustředit na Cura a PrusaSlicer. Neodpovídám za případné škody způsobeny nesprávnou manipulací s tiskárnou nebo Slicerem.<br/>`,
  printGuideSupportWarningTitle: 'Mějte na paměti, že ne všechny tiskárny/firmwary tiskáren podporují tuto funkci!',
  printGuideSupportWarningMessage: `
  Toto je pouze obecný návod nepokrývající všechny typy tiskáren nebo jejich firmwarů.<br/>
  Doporučuji udělat test pomocí tisku malého objektu. Pokud máte potíže s touto funkcí, prosím, vyhledejte pomoc na internetu zadáním madelu Vaší tiskárny a najít, zda podporuje příkaz <strong>M600</strong> pro změnu filamentu.<br/>`,
  printGuideGenerateQRCode: 'Generování QR kódu',
  printGuideGenerateQRCodeSteps: `
  <li>Vyberte typ QR kódu v záložce "nastavení QR kódu".</li>
  <li>Vyplňte požadované pole.</li>
  <li>Upravte 3D model v záložce "Možnosti 3D Modelu".</li>
  <li>Klikněte na "Generovat 3D Model"</li>
  <li>Stáhněte STL soubor kliknutím na "Stáhnout STL" vpravo nahoře.</li>`,
  printGuideVersionDisclaimer: 'Verze {version}, vzhled od vaší verze se může lišit.',
  // Cura
  printGuideCuraStep1: `
  Vyberte vrstvu, ve které chcete výměnu provést.<br/>
  V tomto případě porvedeme výměnu při vrstvě 16.<br/>`,
  printGuideCuraStep2: `
  <li>Jďete "Extensions -> Post Processing -> Modify G-Code".</li>
  <li>Klikněte na "Add a script" a poté "Filament Change".</li>
  <li>V nastavení Změna filamentu, nastavte parametr "Layer" na hodnotu podle kroku 1.</li>
  <li>Reslicujte svůj model. Ikona nalevo od tlačítka "Slice" indikuje aktivní úpravu.</li>`,
  // PrusaSlicer
  printGuidePrusaSlicerStep1: `
  Vyslicujte model a vyberte vrstvu, po ktreré chcete změnu provést.<br/>
  V tomto případě je jedná o vrstvu 11.<br/>`,
  printGuidePrusaSlicerStep2: `
  <li>Klikněte na malou ikonku plus napravo od posuvníku výberu vrstvy.</li>
  <li>PrusaSlicer vytvoří hezký náhled různých barev, díky tomu můžete zkontrolovat správnost výběru. Části QR kódu by měli mít jinou barvu, než je barva základny.</li>
  <li>Reslicujte svůj model.</li>`,
  printGuideStep3: `
  Můžete vytisknout model, jako při každém tisku.<br/>
  3D tiksárna se sama pozastaví a vyčká na změnu filametu.
  Po výměně filamentu bude tiskárna pokračovat v tisku.`,

  //
  // FAQ Section
  //
  faqTitle: 'Často kladené otázky',
  faqQuestion1: 'Jaké formáty souborů mohu exportovat?',
  faqAnswer1: 'Můžete exportovat své 3D modely jako STL soubory (binární i ASCII formáty) pro 3D tisk, nebo jako PNG obrázky pro náhled.',
  faqQuestion2: 'Jaký je rozdíl mezi úrovněmi opravy chyb?',
  faqAnswer2: 'Vyšší úrovně opravy chyb činí QR kód odolnějším proti poškození a chybám skenování, ale také činí kód hustějším s více moduly. Pro 3D tisk obvykle nejlépe fungují úrovně Medium (M) nebo Quartile (Q).',
  faqQuestion3: 'Proč se můj QR kód po vytištění nedá správně naskenovat?',
  faqAnswer3: 'Ujistěte se, že je dostatečný kontrast mezi moduly QR kódu a základnou. Použijte filament různých barev nebo se ujistěte, že výškový rozdíl je dostatečně významný. Také zkontrolujte, zda je rozlišení vaší tiskárny dostatečné pro velikost QR kódu.',
  faqQuestion4: 'Bude můj QR kód fungovat navždy nebo vyprší?',
  faqAnswer4: 'Samotný vygenerovaný QR kód bude fungovat navždy. Pokud však používáte QR kód k odkazu na externí stránku, odkaz se může časem pokazit. To je mimo naši kontrolu. Pokud je to stránka, kterou vlastníte, ujistěte se, že odkaz zůstane online. Pokud je to stránka třetí strany a oni aktualizují svou stránku, odkaz může přestat fungovat. Můžete použít zkracovač URL, který vám umožní změnit cílový odkaz po vytvoření. Spotify kódy budou fungovat, dokud Spotify tuto funkci nezruší.',
  faqQuestion5: 'Jak mohu tisknout QR kódy s mou vícebarevnou 3D tiskárnou?',
  faqAnswer5: 'Při exportu QR kódu vyberte možnost stáhnout 3D model v několika částech. Tato možnost se nachází v horní části stránky, přímo vlevo od tlačítka STL exportu. Tím se vytvoří zip soubor obsahující všechny různé části 3D modelu. Načtěte všechny části do vašeho sliceru a překryjte je jedna přes druhou. Nyní můžete přiřadit barvy různým částem ve vašem sliceru. Můžete také vytvořit 2D vypadající tištěný QR kód nastavením hodnoty výšky vašeho QR kódu na velmi nízké nastavení (např. 0,1 mm). Prosím zkontrolujte náhled ve vašem sliceru, abyste se ujistili, že vše funguje podle očekávání.',
  faqQuestion6: 'Jak mohu vygenerovat více QR kódů najednou?',
  faqAnswer6: 'Použijte funkci Dávkový režim! Klikněte na tlačítko "Dávkový režim" v sekci Nastavení QR kódu. Nejprve nakonfigurujte své výchozí nastavení v hlavním formuláři. Poté stáhněte CSV šablonu, vyplňte ji svými daty (jeden QR kód na řádek) a nahrajte ji. Nástroj vygeneruje všechny QR kódy a zabalené je do ZIP souboru ke stažení. Každý QR kód můžete přizpůsobit vyplněním příslušného sloupce, nebo nechat buňky prázdné pro použití vašich výchozích nastavení. Najeďte myší na jakýkoli popisek v hlavním formuláři pro zobrazení názvu pole pro použití v CSV.',

  // FAQ Footer
  faqFooter: 'Máte-li další otázky, neváhejte mě kontaktovat a já je přidám na seznam:',
  faqContact: 'Pošlete mi e-mail s vaší otázkou',

  //
  // Dávkový režim
  //
  batchMode: 'Dávkový režim',
  batchModeDescription: 'Vygenerujte více QR kódů ze souboru CSV. Každý řádek v CSV vytvoří samostatný STL soubor.',
  batchHowToTitle: 'Jak používat Dávkový režim:',
  batchStep1: 'Nejprve nakonfigurujte nastavení QR kódu v hlavním formuláři (typ obsahu, možnosti modelu atd.). Ty budou použity jako výchozí.',
  batchStep2: 'Stáhněte si CSV šablonu níže. Obsahuje všechna dostupná pole pro váš vybraný typ obsahu.',
  batchStep3: 'Vyplňte CSV svými daty. Každý řádek se stane jedním QR kódem. Nechte buňky prázdné pro použití výchozích nastavení.',
  batchStep4: 'Nahrajte CSV soubor a klikněte na "Generovat vše" pro vytvoření QR kódů jako ZIP archivu.',
  batchTips: 'Tipy:',
  batchTip1: 'Najeďte myší na jakýkoli popisek v hlavním formuláři pro zobrazení názvu pole (např. "base.width", "code.depth").',
  batchTip2: 'Přidejte sloupec "filename" pro přizpůsobení názvů výstupních souborů (bez přípony .stl).',
  batchTip3: 'CSV může používat čárku (,) nebo středník (;) jako oddělovač.',
  batchTemplateDownload: 'Krok 1: Stáhnout CSV šablonu',
  batchTemplateHelp: 'Stáhněte si soubor CSV šablony se všemi dostupnými poli pro aktuálně vybraný typ obsahu. Šablona obsahuje ukázkový řádek s vašimi aktuálními nastaveními.',
  downloadCsvTemplate: 'Stáhnout šablonu',
  uploadCsvFile: 'Krok 2: Nahrát CSV soubor',
  chooseFile: 'Vybrat soubor...',
  noFileSelected: 'Žádný soubor nevybrán',
  batchLargeWarning: 'Chystáte se vygenerovat {count} QR kódů. To může chvíli trvat a spotřebovat hodně paměti. Zvažte rozdělení do menších dávek, pokud narazíte na problémy.',
  batchPreview: 'Náhled',
  batchShowingRows: 'zobrazeno {shown} z {total} řádků',
  batchMoreRows: '...a dalších {count} řádků',
  batchValidation: 'Validace',
  batchValidRows: 'Platné řádky',
  batchInvalidRows: 'Neplatné řádky (budou přeskočeny)',
  batchProcessing: 'Generování QR kódů...',
  batchProgress: 'Zpracování {current} z {total}',
  batchCurrentItem: 'Aktuální',
  batchGenerate: 'Generovat vše',
  batchAbort: 'Přerušit',
  batchDownloadZip: 'Stáhnout ZIP',
  batchStartNew: 'Nová dávka',
  batchSuccessCount: 'Úspěšně vygenerováno {count} QR kód(ů)!',
  batchErrorCount: 'Nepodařilo se vygenerovat {count} QR kód(ů)',
  batchRowError: 'Řádek {row}: {error}',
  batchMoreErrors: '...a dalších {count} chyb',
  batchParseError: 'Chyba při analýze CSV',
  batchFileReadError: 'Chyba při čtení souboru',
  batchNoDataRows: 'CSV soubor musí obsahovat alespoň řádek záhlaví a jeden datový řádek',
  batchMissingRequiredField: 'CSV musí obsahovat alespoň jeden z těchto sloupců: {fields}',
  batchEmptyQRText: 'Prázdný obsah QR kódu',
  cancel: 'Zrušit',
  close: 'Zavřít',
  or: 'nebo',
};
