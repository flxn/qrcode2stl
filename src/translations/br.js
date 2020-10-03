export default {
  //
  //  Local name of the language
  //
  languageLocalName: 'BrazillianPortuguese',

  //
  // General
  //
  title: '3D Code Generator',
  subtitle: 'Export QR codes or Spotify codes as STL for 3D printing // Exporte QR code ou Spotify codes como STL para impressão 3D',
  preview: 'Visualizar',
  controlsHint: 'Use seu mouse para rotacionar',
  changeLanguage: 'Mudar Idioma',
  contributeTranslation: 'Contribuir com tradução',
  generateButton: 'Gerar modelo 3D',
  scrollDownForGuide: 'Role para baixo para instruções sobre como imprimir seu QR code',
  printabilityWarning: 'Aviso sobre impressão 3D',
  printabilityWarningBody: 'Pelo menos um canto do menor elemento no modelo 3D é muito pequeno: {dimensions}. Dependendo das suas configurações, isso pode dificultar a impressão',
  supportMe: 'Me ajude',
  viewOnGithub: 'Ver no GitHub',
  shareButtonTitle: 'Compartilhe esta página',
  file: 'arquivo',
  no: 'não',
  yes: 'sim',
  top: 'topo',
  bottom: 'baixo',
  left: 'esquerda',
  right: 'direita',
  content: 'conteúdo',
  min: 'mínimo',
  max: 'máximo',
  thankYou: 'Muito obrigado pela ajuda. Você arrasa!',
  promotionTitle: 'Gostaria de iniciar um novo hobbie? Procurando por uma segunda/terceira impressora? 😉',
  promotionSubtitle: 'Aqui estão algumas impressoras 3D recomendadas e acessórios',
  corner: 'canto',
  isGenerating: 'Gerando modelo 3D...',
  headerShareNotice: 'Compartilhe seu código com esta URL',

  //
  // QR Code Options Panel
  //
  qrCodeOptionsTitle: 'Opções do QR Code',
  qrCodeTextPlaceholder: 'Texto para seu QR code ex: Olá Mundo ou https://flxn.de',
  errorCorrection: 'Correção de Erro',
  errorCorrectionHelp: 'Quanto maior o nível de correção de erro, mais denso será o QR code',
  optionalFieldsHint: 'Nem todos os campos precisam ser preenchidos',
  // Wifi
  ssidPlaceholder: 'Nome da rede Wifi',
  password: 'Senha',
  passwordPlaceholder: 'Senha da rede Wifi',
  security: 'Segurança',
  hidden: 'Oculto',
  hiddenText: 'SSID está oculto',
  // Contact
  contact: 'Contato',
  yourName: 'Seu Nome',
  firstname: 'Nome',
  lastname: 'Sobrenome',
  organization: 'Organização',
  role: 'Cargo',
  numbers: 'Números',
  cellphone: 'Celular',
  phone: 'Telefone',
  street: 'Rua',
  city: 'Cidade',
  state: 'Estado',
  // E-Mail
  recipient: 'Destinatário',
  recipientPlaceholder: 'O endereço que irá receber o e-mail',
  subject: 'Assunto',
  subjectPlaceholder: 'Linha de assunto.',
  body: 'Corpo',
  bodyPlaceholder: 'O conteúdo do e-mail',
  // SMS
  phonePlaceholder: 'O número do destinatário',
  smsMessage: 'Mensagem',
  smsMessagePlaceholder: 'Mensagem SMS',

  //
  // Spotify Options Panel
  //
  spotifyOptions: 'Opções do Spotify Code',
  spotifyUri: 'Spotify URI/Link',
  spotifyUriHelp: 'Você pode conseguir o Spotify URI para uma faixa/album/playlist no Spotify clicando em "Compartilhar" e "URI"',
  spotifyCodeHeightInfo: 'Spotify Codes tem uma proporção fixa de 4:1',

  //
  // 3D Model Options Panel
  //
  modelOptions: 'Opções do modelo 3D',
  base: 'Base',
  width: 'Largura',
  height: 'Altura',
  depth: 'Profundidade',
  cornerRadius: 'Raio do Canto',
  border: 'Borda',
  borderAroundBase: 'Inserir uma borda ao redor da base',
  margin: 'Margem',
  block: 'Bloqueio',
  style: 'Estilo',
  shape: 'Forma',
  rectangle: 'retangulo',
  roundedRectangle: 'retangulo arredondado', // PARTE #1
  square: 'square',
  round: 'round',
  size: 'Size',
  blockSizeHelp: `
  This settings modifies the size of the individual QR code blocks.
  Play around with this value to achieve unique visual looks but keep in mind that this could impact readability of the QR code.\\
  Check the preview with your phone before printing to see if you have gone too far.
  Stay at 100% if you are not sure.
  If you increase this value above 100% (e.g. 120%) the blocks will form connected islands that make the QR code easier to print.`,
  icon: 'Icon',
  noIcon: 'No icon',
  iconSizeHelp: `
  The size of the icon relative to the total width of the QR Code.
  The icon abuses the inbuilt error correction of the qr code. If it is too big the code may not be readable.
  If you want to have a big icon but your phone can't read the QR code you can try to increase the Error Correction Level.`,
  text: 'Text',
  textOnEdge: 'Add a custom title text to your QR code.',
  placement: 'Placement',
  theText: 'The text',
  cityMode: 'QR-City',
  cityModeText: 'Randomly alters the height of the blocks.',
  invert: 'Invert',
  invertText: 'Inverts the structure of the code',
  keychain: 'Keychain',
  keychainHelp: 'Attach hole to the side of the tag (e.g. to attach it to your keychain).',
  mirrorHoles: 'Mirror Holes',
  mirrorHolesHelp: 'Mirror the holes to the opposite side (e.g. to fix it with screws).',
  keychainHoleDiameter: 'Hole Diameter',

  //
  // Export Settings
  //
  exportTypeHelp: 'Just leave this as "binary" to keep file size low. If your software has issues with the generated file, you can try to change this option.',
  exportSeparatePartsHelp: 'If set to "yes" the base and the qr code will be saved as two separate parts for printers with dual extrusion printing. Your browser may ask for permissions to download multiple files.',
  separateParts: 'Separate parts',
  saveAsButton: 'Save as STL',

  //
  // Print Guide
  // with HTML Tags included!
  //
  printGuideTitle: '3D Print Guide',
  printGuideSubtitle: 'How to print a dual color QR code with a single extruder 3d printer?',
  printGuideWIPInfo: 'This guide is a work in progress.',
  printGuideIntro: `
  You can print multi colored objects even with a single extruder by swapping the filament at specific layers.<br/>
  We can use this method to print the base of our QR code and the actual QR code part on the top in two different colors.<br/>
  This technique is what makes 3d printable QR codes possible in the first place.<br/>
  The process is different depending on the slicer software you are using.<br/>
  In this guide I will focus on Cura and PrusaSlicer only and I am taking no responsibility whatsoever if you somehow damage your printer in the process.<br/>`,
  printGuideSupportWarningTitle: 'Keep in mind: Not all printers/firmwares support the necessary functionality!',
  printGuideSupportWarningMessage: `
  This is meant as a general guide, as I can't provide a writeup on every printer/firmware combination out there.<br/>
  I recommend doing a small test print first. If you are having problems getting this to work, please search online if your specific printer model supports the <strong>M600</strong> G-Code command for filament changing.<br/>`,
  printGuideGenerateQRCode: 'Generating the QR code',
  printGuideGenerateQRCodeSteps: `
  <li>Select the type of QR code you want to generate under "QR Code Options".</li>
  <li>Fill out the necessary fields.</li>
  <li>Configure the 3d model under "3D Model Options".</li>
  <li>Click on "Generate 3D Model"</li>
  <li>Save the stl file via the "Save As STL" button in the top right.</li>`,
  printGuideVersionDisclaimer: 'Version {version}, your experience can differ.',
  // Cura
  printGuideCuraStep1: `
  Slice the model and locate the layer where the color change should happen.<br/>
  In my case this is at layer 16.<br/>`,
  printGuideCuraStep2: `
  <li>Go to "Extensions -> Post Processing -> Modify G-Code".</li>
  <li>Click on "Add a script" then select "Filament Change".</li>
  <li>In the Filament Change settings, set the "Layer" value to your layer number from step 1.</li>
  <li>Re-Slice your model. The icon left of the "Slice" button indicates an active Post Processing script.</li>`,
  // PrusaSlicer
  printGuidePrusaSlicerStep1: `
  Slice the model and locate the layer where the color change should happen.<br/>
  In my case this is at layer 11.<br/>`,
  printGuidePrusaSlicerStep2: `
  <li>Click on the little plus sign right of the layer selection bar.</li>
  <li>PrusaSlicer gives you a nice preview where you can see the different colors to verify that you selected the right layer. The qr code parts should have a different color than the base</li>
  <li>Re-Slice your model.</li>`,
  printGuideStep3: `
  You can now print the model as usual.<br/>
  The 3d printer will pause on the specified layer and move to the origin of the print bed.
  Now you can swap the filament and restart the print job from your printers menu.`,

};
