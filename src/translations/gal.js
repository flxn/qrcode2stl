export default {
  //
  //  Local name of the language
  //
  languageLocalName: 'Galego',

  //
  // Xeral
  //
  title: 'Xerador de códigos 3D',
  subtitle: 'Exporta códigos QR ou de Spotify como STL para impresión 3D',
  preview: 'Previsualizar',
  controlsHint: 'Usa o rato para rotar',
  changeLanguage: 'Cambia o idioma',
  contributeTranslation: 'Contribúe cunha traducción',
  generateButton: 'Xera o modelo 3D',
  scrollDownForGuide: 'Desliza para unha guía sobre como imprimir o teu código QR.',
  printabilityWarning: 'Advertencia sobre a impresión 3D',
  printabilityWarningBody: 'Polo menos un borde do elemento máis pequeno do modelo 3D é moi pequeno: {dimensións}. Dependendo da súa configuración, isto pode dificultar a impresión.',
  supportMe: 'Apoia qrcode2stl',
  viewOnGithub: 'GitHub',
  shareButtonTitle: 'Comparte esta páxina',
  file: 'arquivo',
  no: 'no',
  yes: 'si',
  top: 'arriba',
  bottom: 'abaixo',
  left: 'esquerda',
  right: 'dereita',
  content: 'contido',
  min: 'min',
  max: 'max',
  thankYou: 'Moitas grazas pola axuda. Es a caña!',
  promotionTitle: 'Queres comezar un novo hobbie? Andas a búsqueda dunha segunda/terceira impresora 3d?',
  promotionSubtitle: 'Aquí hai varias impresoras 3D e accesorios. Se queres aopoiar o desarrollo de esta ferramenta por favor, considera utilizar estas ligazóns para mercar en AliExpress.',
  corner: 'esquina',
  isGenerating: 'Xerando modelo 3D...',
  headerShareNotice: 'Comparte o teu código con esta URL',
  copyExistingQRCode: 'Copia un código QR existente',
  holdQRCodeInView: 'Coloca o código QR no visor da cámara',
  decodedQRCodeData: 'Os datos do QR foron decodificados',

  //
  // Panel de opcións do Código QR
  //
  qrCodeOptionsTitle: 'Opcións do código QR',
  qrCodeTextPlaceholder: 'O texto para o teu código QR ex:Ola mundo ou https://flxn.de',
  errorCorrection: 'Corrección do erro',
  errorCorrectionHelp: 'Cato mais alta sexa a corrección do erro, mais denso será o código QR.',
  optionalFieldsHint: 'Non todos os campos han de ser enchidos.',
  // Wifi
  ssidPlaceholder: 'O nome da rede WiFi',
  password: 'Contrasinal',
  passwordPlaceholder: 'O contrasinal da rede WiFi',
  security: 'Seguridade',
  hidden: 'Ocula',
  hiddenText: 'a SSID está ocula',
  // Contact
  contact: 'Contacto',
  yourName: 'Nome',
  firstname: 'Nome',
  lastname: 'Apelidos',
  organization: 'Organización',
  role: 'Posto',
  numbers: 'Números',
  cellphone: 'Número de teléfono',
  phone: 'Teléfono',
  street: 'Rúa',
  city: 'Cidade',
  state: 'Estado',
  // E-Mail
  recipient: 'Destino',
  recipientPlaceholder: 'A dirección de correo que recibirá o email.',
  subject: 'Asunto',
  subjectPlaceholder: 'O asunto do email',
  body: 'Corpo',
  bodyPlaceholder: 'O contido do email',
  // SMS
  phonePlaceholder: 'Número de teléfono ao que lle chegará a mensaxe',
  smsMessage: 'Mensaxe',
  smsMessagePlaceholder: 'A mensaxe SMS',
  // Calendar
  calendar: 'Calendario',
  eventName: 'Nome do evento',
  eventNamePlaceholder: 'Nome do evento',
  startDate: 'Data de inicio',
  startTime: 'Hora de inicio',
  endDate: 'Data de fin',
  endTime: 'Hora de fin',
  allDay: 'Todo o día',
  allDayEvent: 'Evento de todo o día',
  location: 'Lugar',
  locationPlaceholder: 'Lugar do evento (opcional)',
  description: 'Descrición',
  descriptionPlaceholder: 'Descrición do evento (opcional)',

  //
  // Panel de Opcións de Spotify
  //
  spotifyOptions: 'Opcións do código de Sporify',
  spotifyUri: 'URI/Ligazón de Spotify',
  spotifyUriHelp: 'Podes obter a URI de Spotify para unha canción/album/playlist/usuario dende Spotify clicando "Compartir" e logo "URI".',
  spotifyCodeHeightInfo: 'Os códigos de Spotify teñen unha ratio fixa de 4:1',

  //
  // Panel de opcións do Modelo 3D
  //
  modelOptions: 'Opcións do modelo 3D',
  base: 'Base',
  width: 'Ancho',
  height: 'Alto',
  depth: 'Profundo',
  cornerRadius: 'Radio da esquina',
  border: 'Borde',
  borderAroundBase: 'Engade un borde ao redor da base',
  margin: 'Marxe',
  block: 'Bloquear',
  style: 'Estilo',
  shape: 'Forma',
  rectangle: 'rectángulo',
  roundedRectangle: 'rectángulo redondeado',
  square: 'cadrado',
  round: 'redondo',
  size: 'Tamaño',
  blockSizeHelp: `
  Estos axustes modifican o tamaño de cada bloque do QR de modo individual.
  Xoga con este valor para conseguir un aspecto visual único, pero ten en conta que isto pode afectar á lexibilidade do código QR.\\
  Comproba a vista previa co teu teléfono antes de imprimir para ver se foches demasiado lonxe.
  Mantente ao 100% se non estás seguro.
  Se aumentas este valor por encima do 100% (por exemplo, 120%), os bloques formarán illas conectadas que facilitan a impresión do código QR.`,
  icon: 'Icona',
  noIcon: 'Non icona',
  iconSizeHelp: `
  O tamaño da icona en relación ao ancho total do código QR.
  A icona abusa da corrección de erros integrada do código qr. Se é demasiado grande, o código pode non ser lexible.
  Se queres ter unha icona grande pero o teu teléfono non pode ler o código QR, podes tentar aumentar o nivel de corrección de erros.`,
  text: 'Texto',
  textOnEdge: 'Engade un texto personalizado ao teu código QR.',
  placement: 'Lugar',
  theText: 'Normal\n*Cursiva*\n**Negrita**\n***Cursiva e negrita***',
  fontInfoText: 'Cambia o tipo de letra para liñas individuais:',
  italicInfoText: '*cursiva*',
  boldInfoText: '**negrita**',
  cityMode: 'QR-Cidade',
  cityModeText: 'Modifica aleatoriamente a altura dos bloques.',
  invert: 'Invertir',
  invertText: 'Invirte a estructura do código',
  keychain: 'Chaveiro',
  keychainHelp: 'Coloca un burato ao lado da etiqueta (por exemplo, para pegala ao teu chaveiro).',
  mirrorHoles: 'Buratos en espello',
  mirrorHolesHelp: 'Espelle os buratos no lado oposto (por exemplo, para fixalo con parafusos).',
  keychainHoleDiameter: 'Diámetro do oco',
  nfcIndentation: 'NFC/RFID',
  nfcIndentationHelp: 'Engade unha cavidade na parte inferior da base onde se pode inserir unha etiqueta NFC/RFID.',
  indentation: 'Cavidade',
  nfcIndentationHiddenHelp: 'Crea unha cavidade no interior da base cunha compensación de 1 mm desde a parte inferior da base. Isto permítelle inserir firmemente a etiqueta NFC dentro da propia impresión 3D. Deteña a impresión antes da capa de peche, insira a etiqueta e, a continuación, retome a impresión. Asegúrese de que a profundidade da sangría sexa lixeiramente maior que a propia etiqueta e axuste a profundidade da base en consecuencia.',

  //
  // Axustes de exportación
  //
  exportTypeHelp: 'Simplemente deixe isto como "binario" para manter o tamaño do ficheiro baixo. Se o teu software ten problemas co ficheiro xerado, podes tentar cambiar esta opción.',
  exportSeparatePartsHelp: 'Se se define como "si", a base e o código qr gardaranse como dúas partes separadas para as impresoras con impresión de dobre extrusión. É posible que o teu navegador solicite permisos para descargar varios ficheiros.',
  separateParts: 'Separar partes',
  saveAsButton: 'Gardar como STL',

  //
  // Guía de impresión
  // con etiquetas HTML incluídas!
  //
  printGuideTitle: 'Guía de impresión 3D',
  printGuideSubtitle: 'Como imprimir un código QR de dúas corescunha única impresora 3D de extrusión simple?',
  printGuideWIPInfo: 'Esta guía é un traballo en proceso.',
  printGuideIntro: `
  Podes imprimir obxectos de varias cores incluso con un único extrusor intercambiando o filamento en capas específicas.<br/>
  Podemos usar este método para imprimir a base do noso código QR e a parte real do código QR na parte superior en dúas cores diferentes.<br/>
  Esta técnica e o que fai que os códigos QR sexan imprimibles<br/>
  O proceso é diferente dependendo do laminador que estea a usar.<br/>
  Nesta guía centrareime só en Cura e PrusaSlicer e non asumo ningunha responsabilidade se dana dalgunha maneira a súa impresora durante o proceso.<br/>`,
  printGuideSupportWarningTitle: 'Teña en conta: non todas as impresoras/firmwares admiten a funcionalidade necesaria.',
  printGuideSupportWarningMessage: `
  Trátase dunha guía xeral, xa que non podo proporcionar un resumo de cada combinación de impresora/firmware que hai.<br/>
  Recomendo primeiro facer unha pequena proba de impresión. Se tes problemas para que isto funcione, busca se o teu modelo de impresora específico admite o comando G-Code <strong>M600</strong> para o cambio de filamento.<br/>`,
  printGuideGenerateQRCode: 'Xerando o código QR',
  printGuideGenerateQRCodeSteps: `
  <li>Seleccione o tipo de código QR que quere xerar en "Opcións do código QR".</li>
  <li>Encha os campos necesarios.</li>
  <li>Configure o modelo 3D en "Opcións do modelo 3D".</li>
  <li>Fai clic en "Xerar modelo 3D"</li>
  <li>Garda o ficheiro stl mediante o botón "Gardar como STL" na parte superior dereita.</li>`,
  printGuideVersionDisclaimer: 'Versión {versión}, a túa experiencia pode diferir.',

  // Cura
  printGuideCuraStep1: `
  Lamine o modelo e localice a capa onde debería ocorrer o cambio de cor.<br/>
  No meu caso é na capa 16.<br/>`,
  printGuideCuraStep2: `
  <li>Vai a "Extensións -> Post procesado -> Modificar G-Code".</li>
  <li>Selecciona "Engade un guión" logo selecciona "Cambio de filamento".</li>
  <li>Na configuración de cambio de filamento, establece o valor de "Capa" no número de capa do paso 1.</li>
  <li>Lamina de novo o teu modelo. A icona á esquerda do botón "Laminar" indica un guión de postprocesamento activo.</li>`,
  // PrusaSlicer
  printGuidePrusaSlicerStep1: `
  Lamine o modelo e localice a capa onde debería ocorrer o cambio de cor.<br/>
  No meu caso é na capa 16.<br/>`,
  printGuidePrusaSlicerStep2: `
  <li>Fai clic no pequeno signo máis á dereita da barra de selección de capas.</li>
  <li>PrusaSlicer ofrécete unha vista previa onde podes ver as diferentes cores para verificar que seleccionaches a capa correcta. As partes do código qr deben ter unha cor diferente á base</li>
   <li>Volve dividir o teu modelo.</li>`,
  printGuideStep3: `
  Agora podes imprimir o modelo como sempre.<br/>
  A impresora 3D fará unha pausa na capa especificada e desprazarase á orixe da cama de impresión.
   Agora podes cambiar o filamento e reiniciar o traballo de impresión desde o menú das túas impresoras.`,

  //
  // Sección FAQ
  //
  faqTitle: 'Preguntas Frecuentes',
  faqQuestion1: 'Que formatos de arquivo podo exportar?',
  faqAnswer1: 'Podes exportar os teus modelos 3D como arquivos STL (formatos binario e ASCII) para impresión 3D, ou como imaxes PNG para previsualización.',
  faqQuestion2: 'Cal é a diferenza entre os niveis de corrección de erros?',
  faqAnswer2: 'Niveis máis altos de corrección de erros fan que o código QR sexa máis resistente aos danos e aos erros de escaneado, pero tamén fan que o código sexa máis denso con máis módulos. Para impresión 3D, os niveis Medium (M) ou Quartile (Q) xeralmente funcionan mellor.',
  faqQuestion3: 'Por que o meu código QR non se escanea correctamente despois da impresión?',
  faqAnswer3: 'Asegúrate de que hai suficiente contraste entre os módulos do código QR e a base. Usa filamentos de cores diferentes ou asegúrate de que a diferenza de altura sexa significativa. Tamén comproba que a resolución da túa impresora sexa suficiente para o tamaño do código QR.',
  faqQuestion4: 'O meu código QR seguirá funcionando para sempre ou caduca?',
  faqAnswer4: 'O código QR xerado en si mesmo seguirá funcionando para sempre. Sen embargo, se estás usando o código QR para enlazar cunha páxina externa, o enlace pode romperse co tempo. Isto está fóra do noso control. Se é unha páxina túa, asegúrate de que o enlace permaneza en liña. Se é unha páxina de terceiros e actualizan o seu sitio, o enlace pode deixar de funcionar. Podes usar un acortador de URL que che permita cambiar o enlace de destino despois da creación. Os códigos de Spotify funcionarán ata que Spotify descontinúe esta función.',
  faqQuestion5: 'Como podo imprimir códigos QR coa miña impresora 3D multicolor?',
  faqAnswer5: 'Ao exportar o código QR, selecciona a opción para descargar o modelo 3D en varias partes. Esta opción está situada na parte superior da páxina, directamente á esquerda do botón de exportación STL. Isto crea un arquivo zip que contén todas as diferentes partes do modelo 3D. Carga todas as partes no teu slicer e sobrepón unhas sobre outras. Agora podes asignar cores ás diferentes partes no teu slicer. Tamén podes crear un código QR impreso con aspecto 2D establecendo o valor da altura do teu código QR nunha configuración moi baixa (por exemplo, 0,1mm). Por favor, comproba a vista previa no teu slicer para asegurarte de que todo funciona como se espera.',

  // FAQ Footer
  faqFooter: 'Se tes preguntas adicionais, non dubides en contactar comigo e engadiráas á lista:',
  faqContact: 'Envíame un correo electrónico coa túa pregunta',
};
