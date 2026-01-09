export default {
  //
  //  Local name of the language
  //
  languageLocalName: 'Brazillian Portuguese',

  //
  // General
  //
  title: '3D Code Generator',
  subtitle: 'Exporte QR codes ou Spotify codes como STL para impressão 3D',
  preview: 'Visualizar',
  controlsHint: 'Use seu mouse para rotacionar',
  changeLanguage: 'Mudar Idioma',
  contributeTranslation: 'Contribuir com tradução',
  generateButton: 'Gerar modelo 3D',
  scrollDownForGuide: 'Role para baixo para instruções sobre como imprimir seu QR code',
  printabilityWarning: 'Aviso sobre impressão 3D',
  printabilityWarningBody: 'Pelo menos um canto do menor elemento no modelo 3D é muito pequeno: {dimensions}. Dependendo das suas configurações, isso pode dificultar a impressão',
  supportMe: 'Suporte qrcode2stl',
  viewOnGithub: 'GitHub',
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
  promotionTitle: 'Gostaria de iniciar um novo hobbie? Procurando por uma segunda/terceira impressora?',
  promotionSubtitle: 'Aqui estão algumas impressoras 3D recomendadas e acessórios',
  corner: 'canto',
  isGenerating: 'Gerando modelo 3D...',

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
  // Calendar
  calendar: 'Calendário',
  eventName: 'Nome do Evento',
  eventNamePlaceholder: 'Nome do evento',
  startDate: 'Data de Início',
  startTime: 'Hora de Início',
  endDate: 'Data de Fim',
  endTime: 'Hora de Fim',
  allDay: 'Dia Todo',
  allDayEvent: 'Evento de dia inteiro',
  location: 'Localização',
  locationPlaceholder: 'Local do evento (opcional)',
  description: 'Descrição',
  descriptionPlaceholder: 'Descrição do evento (opcional)',

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
  roundedRectangle: 'retangulo arredondado',
  square: 'quadrado',
  round: 'círculo',
  size: 'Tamanho',
  blockSizeHelp: `
  Esta configuração modifica o tamanho dos blcos individuais do QR code.
  Brinque com este valor para atingir visuais únicos mas tenha em mente que isto pode impactar na leitura ou não do QR code.\\
  Cheque a visualização com o seu celular antes de imprimir para ver se você não está indo muito longe.
  Deixe em 100% se você não estiver 100% certo.
  Se você subir este valor acima de 100% (ex: 120%) os blocos vão formar ilhas conectadas para fazer o QR code mais fácil de imprimir`,
  icon: 'Ícone',
  noIcon: 'Sem Ícone',
  iconSizeHelp: `
  O tamanho do ícone relativo a largura do QR Code.
  O ícone abusa da correção de erros embutida do qr code. Se for muito grande o código pode ficar ilegível.
  Se você quiser um ícone grande, mas seu telefone não puder ler o QR code você pode tentar aumentar o nível de correção de erro.`,
  text: 'Texto',
  textOnEdge: 'Adicionar um título personalizado ao seu QR code',
  placement: 'Colocação',
  theText: 'Texto',
  cityMode: 'QR-City',
  cityModeText: 'Altera aleatoriamente a altura dos blocos',
  invert: 'Inverter',
  invertText: 'Inverte a estrutura do QR code',
  keychain: 'Chaveiro',
  keychainHelp: 'Insere um buraco do lado da tag (ex: para usar como chaveiro).',
  mirrorHoles: 'Espelhar Buracos',
  mirrorHolesHelp: 'Espelha os buracos para o lado oposto (ex: para pendurar com parafusos).',
  keychainHoleDiameter: 'Diâmetro do furo',

  //
  // Export Settings
  //
  exportTypeHelp: 'Simplesmente deixe isso como "Binário" para manter o arquivo pequeno. Se seu software tiver problemas com o arquivo gerado, você pode tentar mudar esta opção',
  exportSeparatePartsHelp: 'Se você colocar "sim" a base e o qr code vão ser salvos em partes separadas para impressoras com extrusão dupla. Seu navegador pode pedir permissão para baixar múltiplos arquivos',
  separateParts: 'Separar as partes',
  saveAsButton: 'Salvar como STL',

  //
  // Print Guide
  // with HTML Tags included!
  //
  printGuideTitle: 'Guia de impressão 3D',
  printGuideSubtitle: 'Como imprimir um QR code de duas cores com uma impressora de extrusão simples?',
  printGuideWIPInfo: 'Este guia é um trabalho em progresso.',
  printGuideIntro: `
  Você pode imprimir objetos multicoloridos mesmo com uma extrusora simples trocando o filamento em camadas específicas.<br/>
  Nós usamos este método para imprimir a base do seu QR code e o QR code em si no topo com duas cores diferentes.<br/>
  Esta técnica e o que faz os QR codes imprimíveis possíveis para começo de conversa.<br>
  Este processo é diferente dependendo do fatiador que você está usando.<br/>
  Neste guia, Eu vou focar no Cura e no PrusaSlicer, e Não assumo nenhuma responsabilidade se você causar algum dano a sua impressora no processo<br/>`,
  printGuideSupportWarningTitle: 'Tenha em mente que nem todas as impressoras/firmwares suportam a funcionalidade necessária!',
  printGuideSupportWarningMessage: `
  Este é um guia genérico, uma vez que não posso fornecer o guia para todas as impressoras/firmwares que existem.<br/>
  Eu recomendo fazer um pequeno teste de impressão primeiro. Se você estiver tento problemas para fazer isto funcionar, por favor procure online se seu modelo de impressora específico suporte o comando G-Code <strong>M600</strong> para troca de filamento`,
  printGuideGenerateQRCode: 'Gerando o QR code',
  printGuideGenerateQRCodeSteps: `
  <li>Escolha o tipo de QR code que quer gerar em "Opções do QR Code"</li>
  <li>Preencha os campos necessários</li>
  <li>Configure o modelo 3D em "Opções do Modelo 3D"</li>
  <li>Clique em "Gerar Modelo 3D"</li>
  <li>Salve o arquivo stl no botão "Salvar Como STL" no canto superior direito</li>`,
  printGuideVersionDisclaimer: 'Versão {version}, você poderá ter uma experiencia diferente',
  // Cura
  printGuideCuraStep1: `
  Fatie o modelo e localize a camada onde a troca de cor poderia acontecer<br/>
  No meu caso, isso foi na camada 16.<br/>`,
  printGuideCuraStep2: `
  <li>Vá para "Extensões -> Pós-Processamento -> Modificar G-Code</li>
  <li>Clique em "Adicionar um Script" então selecione "Troca de Filamento".</li>
  <li>Nas opções de troca de filamento, coloque em "Camada" o número de camada do passo 1</li>
  <li>Fatie novamente seu modelo. O ícone a esquerda do botão "Fatiar" indica um script de Pós Processamento ativo</li>`,
  // PrusaSlicer
  printGuidePrusaSlicerStep1: `
  Slice the model and locate the layer where the color change should happen.<br/>
  In my case this is at layer 11.<br/>

  Fatie o modelo e localize a camada onde a troca de cor poderá acontecer.<br/>
  No meu caso, isso foi na camada 11<bnr/>`,
  printGuidePrusaSlicerStep2: `
  li>Clique no pequeno ícone de adição na barra de seleção de camada.</li>
  <li>O PrusaSlicer vai te fornecer uma boa prévia onde você poderá ver as cores diferentes para veificar se você selecionou a camada certa. As partes do qr code devem ter uma cor diferente da base</li>
  <li>Fatie novamente seu modelo.</li>`,
  printGuideStep3: `
  Agora, você pode imprimir o modelo como de costume<br/>
  Sua impressora 3D irá pausar na camada especificada e mover-se para a origem da mesa de impressão.
  Agora, você poderá trocar o filamento e reiniciar o processo de impressão no menu da sua impressora.`,

  //
  // FAQ Section
  //
  faqTitle: 'Perguntas Frequentes',
  faqQuestion1: 'Que formatos de arquivo posso exportar?',
  faqAnswer1: 'Você pode exportar seus modelos 3D como arquivos STL (formatos binário e ASCII) para impressão 3D, ou como imagens PNG para visualização.',
  faqQuestion2: 'Qual é a diferença entre os níveis de correção de erro?',
  faqAnswer2: 'Níveis mais altos de correção de erro tornam o código QR mais resistente a danos e erros de digitalização, mas também tornam o código mais denso com mais módulos. Para impressão 3D, os níveis Medium (M) ou Quartile (Q) geralmente funcionam melhor.',
  faqQuestion3: 'Por que meu código QR não escaneia corretamente após a impressão?',
  faqAnswer3: 'Certifique-se de que há contraste suficiente entre os módulos do código QR e a base. Use filamentos de cores diferentes ou certifique-se de que a diferença de altura seja significativa. Verifique também se a resolução da sua impressora é suficiente para o tamanho do código QR.',
  faqQuestion4: 'Meu código QR continuará funcionando para sempre ou expira?',
  faqAnswer4: 'O código QR gerado em si continuará funcionando para sempre. No entanto, se você estiver usando o código QR para vincular a uma página externa, o link pode quebrar com o tempo. Isso está fora do nosso controle. Se for uma página sua, certifique-se de que o link permaneça online. Se for uma página de terceiros e eles atualizarem seu site, o link pode parar de funcionar. Você pode usar um encurtador de URL que permite alterar o link de destino após a criação. Os códigos do Spotify funcionarão até que o Spotify descontinue este recurso.',
  faqQuestion5: 'Como posso imprimir códigos QR com minha impressora 3D multicolorida?',
  faqAnswer5: 'Ao exportar o código QR, selecione a opção para baixar o modelo 3D em várias partes. Esta opção está localizada no topo da página, diretamente à esquerda do botão de exportação STL. Isso cria um arquivo zip contendo todas as diferentes partes do modelo 3D. Carregue todas as partes no seu fatiador e sobreponha-as umas sobre as outras. Agora você pode atribuir cores às diferentes partes no seu fatiador. Você também pode criar um código QR impresso com aparência 2D definindo o valor da altura do seu código QR para uma configuração muito baixa (por exemplo, 0,1mm). Por favor, verifique a visualização no seu fatiador para garantir que tudo funcione como esperado.',
  faqQuestion6: 'Como posso gerar múltiplos códigos QR de uma vez?',
  faqAnswer6: 'Use a função Modo em Lote! Clique no botão "Modo em Lote" na seção de Opções do Código QR. Primeiro, configure suas configurações padrão no formulário principal. Em seguida, baixe o modelo CSV, preencha com seus dados (um código QR por linha) e faça upload. A ferramenta gerará todos os códigos QR e os empacotará em um arquivo ZIP para download. Você pode personalizar cada código QR preenchendo a coluna correspondente, ou deixar células vazias para usar suas configurações padrão. Passe o mouse sobre qualquer rótulo no formulário principal para ver o nome do campo para usar no CSV.',

  // FAQ Footer
  faqFooter: 'Se você tiver perguntas adicionais, sinta-se à vontade para me contatar e eu as adicionarei à lista:',
  faqContact: 'Envie-me um email com sua pergunta',

  //
  // Modo em Lote
  //
  batchMode: 'Modo em Lote',
  batchModeDescription: 'Gere múltiplos QR codes a partir de um arquivo CSV. Cada linha no CSV criará um arquivo STL separado.',
  batchHowToTitle: 'Como usar o Modo em Lote:',
  batchStep1: 'Primeiro, configure as opções do seu QR code no formulário principal (tipo de conteúdo, opções do modelo, etc.). Essas serão usadas como padrão.',
  batchStep2: 'Baixe o modelo CSV abaixo. Ele contém todos os campos disponíveis para o tipo de conteúdo selecionado.',
  batchStep3: 'Preencha o CSV com seus dados. Cada linha se torna um QR code. Deixe células vazias para usar suas configurações padrão.',
  batchStep4: 'Faça upload do arquivo CSV e clique em "Gerar Todos" para criar seus QR codes em um arquivo ZIP.',
  batchTips: 'Dicas:',
  batchTip1: 'Passe o mouse sobre qualquer rótulo no formulário principal para ver o nome do campo (ex: "base.width", "code.depth").',
  batchTip2: 'Adicione uma coluna "filename" para personalizar os nomes dos arquivos de saída (sem extensão .stl).',
  batchTip3: 'O CSV pode usar vírgula (,) ou ponto e vírgula (;) como delimitador.',
  batchTemplateDownload: 'Passo 1: Baixar Modelo CSV',
  batchTemplateHelp: 'Baixe um arquivo modelo CSV com todos os campos disponíveis para o tipo de conteúdo atualmente selecionado. O modelo inclui uma linha de exemplo com suas configurações atuais.',
  downloadCsvTemplate: 'Baixar Modelo',
  uploadCsvFile: 'Passo 2: Enviar Arquivo CSV',
  chooseFile: 'Escolher arquivo...',
  noFileSelected: 'Nenhum arquivo selecionado',
  batchLargeWarning: 'Você está prestes a gerar {count} QR codes. Isso pode demorar e usar bastante memória. Considere dividir em lotes menores se tiver problemas.',
  batchPreview: 'Prévia',
  batchShowingRows: 'mostrando {shown} de {total} linhas',
  batchMoreRows: '...e mais {count} linhas',
  batchValidation: 'Validação',
  batchValidRows: 'Linhas válidas',
  batchInvalidRows: 'Linhas inválidas (serão puladas)',
  batchProcessing: 'Gerando QR Codes...',
  batchProgress: 'Processando {current} de {total}',
  batchCurrentItem: 'Atual',
  batchGenerate: 'Gerar Todos',
  batchAbort: 'Abortar',
  batchDownloadZip: 'Baixar ZIP',
  batchStartNew: 'Iniciar Novo Lote',
  batchSuccessCount: '{count} QR code(s) gerados com sucesso!',
  batchErrorCount: 'Falha ao gerar {count} QR code(s)',
  batchRowError: 'Linha {row}: {error}',
  batchMoreErrors: '...e mais {count} erros',
  batchParseError: 'Erro ao analisar CSV',
  batchFileReadError: 'Erro ao ler arquivo',
  batchNoDataRows: 'O arquivo CSV deve conter pelo menos uma linha de cabeçalho e uma linha de dados',
  batchMissingRequiredField: 'O CSV deve conter pelo menos uma destas colunas: {fields}',
  batchEmptyQRText: 'Conteúdo do QR code vazio',
  cancel: 'Cancelar',
  close: 'Fechar',
  or: 'ou',

  //
  // Importar/Exportar Configurações
  //
  importExportSettings: 'Importar/Exportar Configurações',
  exportSettings: 'Exportar Configurações',
  exportSettingsDescription: 'Copie ou baixe suas configurações atuais como JSON para compartilhar ou fazer backup.',
  importSettings: 'Importar Configurações',
  importSettingsDescription: 'Cole ou carregue um arquivo JSON de configurações para aplicar configurações salvas.',
  copyToClipboard: 'Copiar para Área de Transferência',
  downloadAsFile: 'Baixar como Arquivo',
  loadFromFile: 'Carregar de Arquivo',
  applySettings: 'Aplicar Configurações',
  pasteJsonHere: 'Cole as configurações JSON aqui...',
  copiedToClipboard: 'Copiado para a área de transferência!',
  settingsApplied: 'Configurações aplicadas com sucesso!',
  invalidJsonError: 'Formato JSON inválido',
};
