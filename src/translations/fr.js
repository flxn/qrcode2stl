export default {
  //
  //  Local name of the language
  //
  languageLocalName: 'Français',

  //
  // General
  //
  title: 'Générateur de QR Code',
  subtitle: 'Exportez votre QR code en STL pour l\'impression 3D',
  preview: 'Aperçu',
  controlsHint: 'Utilisez votre souris pour faire pivoter',
  changeLanguage: 'Changer la Langue',
  contributeTranslation: 'Contribuer une traduction',
  generateButton: 'Générer un modèle 3D',
  scrollDownForGuide: 'Faites défiler vers le bas pour voir comment imprimer votre QR Code.',
  printabilityWarning: 'Avertissement pour imprimabilité 3D',
  printabilityWarningBody: 'Au moins un bord du plus petit élément du modèle 3D est très petit: {dimensions}. Selon votre configuration, cela pourrait rendre l\'impression plus difficile.',
  supportMe: 'Soutenir qrcode2stl',
  viewOnGithub: 'GitHub',
  shareButtonTitle: 'Partager cette page',
  file: 'fichier',
  no: 'non',
  yes: 'oui',
  top: 'dessus',
  bottom: 'dessous',
  left: 'gauche',
  right: 'droite',
  content: 'contenu',

  //
  // QR Code Options Panel
  //
  qrCodeOptionsTitle: 'Options du QR Code',
  qrCodeTextPlaceholder: 'Le text pour votre QR code e.g. Hello World ou https://flxn.de',
  errorCorrection: 'Correction des erreurs',
  errorCorrectionHelp: 'Plus le niveau de correction d\'erreur est élevé, plus le QR Code est dense.',
  optionalFieldsHint: 'Tous les champs ne doivent pas être remplis.',
  // Wifi
  ssidPlaceholder: 'Le nom du réseau Wifi',
  password: 'Mot de passe',
  passwordPlaceholder: 'Mot de passe du réseau Wifi',
  security: 'Securité',
  hidden: 'Caché',
  hiddenText: 'SSID caché',
  // Contact
  contact: 'Contact',
  yourName: 'Votre Nom',
  firstname: 'Prénom',
  lastname: 'Nom de famille',
  organization: 'Organisation',
  role: 'Role',
  numbers: 'Numeros',
  cellphone: 'Portable',
  phone: 'Téléphone',
  street: 'Rue',
  city: 'Ville',
  state: 'Etat',
  // E-Mail
  recipient: 'Destinataire',
  recipientPlaceholder: 'L\'adresse qui doit recevoir le mail',
  subject: 'Sujet',
  subjectPlaceholder: 'Sujet de l\'e-mail',
  body: 'Contenu',
  bodyPlaceholder: 'Contenu de l\'e-mail',
  // SMS
  phonePlaceholder: 'Numero de portable du destinataire',
  smsMessage: 'Message',
  smsMessagePlaceholder: 'Message SMS',
  // Calendar
  calendar: 'Calendrier',
  eventName: 'Nom de l\'événement',
  eventNamePlaceholder: 'Nom de l\'événement',
  startDate: 'Date de début',
  startTime: 'Heure de début',
  endDate: 'Date de fin',
  endTime: 'Heure de fin',
  allDay: 'Toute la journée',
  allDayEvent: 'Événement d\'une journée entière',
  location: 'Lieu',
  locationPlaceholder: 'Lieu de l\'événement (optionnel)',
  description: 'Description',
  descriptionPlaceholder: 'Description de l\'événement (optionnel)',

  //
  // 3D Model Options Panel
  //
  modelOptions: 'Options du modèle 3D',
  base: 'Base',
  width: 'Largeur',
  depth: 'Profondeur',
  border: 'Bordure',
  borderAroundBase: 'Ajouter une bordure autour de la base',
  margin: 'Marge',
  block: 'Bloc',
  style: 'Style',
  square: 'carré',
  round: 'rond',
  size: 'Taille',
  blockSizeHelp: `
  Ces paramètres modifient la taille individuels des blocs du QR Code.
  Jouez avec cette valeur pour obtenir des looks visuels uniques, mais gardez à l'esprit que cela pourrait affecter la lisibilité du QR Code.\\
  Vérifiez l'aperçu avec votre téléphone avant d'imprimer pour voir si vous êtes allé trop loin.
  Restez à 100% si vous n'êtes pas sûr.
  Si vous augmentez cette valeur au-dessus de 100% (par exemple 120%), les blocs formeront des îlots connectés qui faciliteront l'impression du QR Code.`,
  icon: 'Icône',
  noIcon: 'Sans icône',
  iconSizeHelp: `
  La taille de l'icône par rapport à la largeur totale du QR Code.
  L'icône abuse de la correction d'erreur intégrée du QR Code. S'il est trop gros, le code peut ne pas être lisible.
  Si vous voulez avoir une grande icône mais que votre téléphone ne peut pas lire le code QR, vous pouvez essayer d'augmenter le niveau de correction d'erreur.`,
  text: 'Text',
  textOnEdge: 'Ajoutez un texte personnalisé à votre QR Code.',
  placement: 'Placement',
  theText: 'Le text',
  cityMode: 'QR-Ville',
  cityModeText: 'Modifie aléatoirement la hauteur des blocs.',

  //
  // Export Settings
  //
  exportTypeHelp: 'Laissez "binaire" pour garder une taille de fichier faible. Si votre logiciel rencontre des problèmes avec le fichier généré, vous pouvez essayer de modifier cette option.',
  exportSeparatePartsHelp: 'Si la valeur est "oui", la base et le code qr seront enregistrés en deux parties distinctes pour les imprimantes avec impression à double extrusion. Votre navigateur peut demander des autorisations pour télécharger plusieurs fichiers.',
  separateParts: 'Pièces séparées',
  saveAsButton: 'Enregistrer en STL',

  //
  // Print Guide
  // with HTML Tags included!
  //
  printGuideTitle: 'Guide d\'impression 3D',
  printGuideSubtitle: 'Comment imprimer un QR code bicolore avec un seul extrudeuse sur votre imprimante 3D?',
  printGuideWIPInfo: 'Ce guide est en cours d\'écriture.',
  printGuideIntro: `
  Vous pouvez imprimer des objets multicolores même avec un seul extrudeur en échangeant le filament sur des couches spécifiques.<br/>
  Nous pouvons utiliser cette méthode pour imprimer la base de votre QR Code et la partie réelle du QR Code sur le dessus en deux couleurs différentes.<br/>
  Cette technique est ce qui rend les QR Code imprimables en 3D dans un premier temps.<br/>
  Le processus est différent selon le logiciel de découpage que vous utilisez.<br/>
  Dans ce guide, je me concentrerai uniquement sur Cura et PrusaSlicer et je ne prends aucune responsabilité si vous endommagez votre imprimante dans le processus.<br/>`,
  printGuideSupportWarningTitle: 'Gardez à l\'esprit: toutes les imprimantes/firmwares ne prennent pas forcément en charge les fonctionnalités nécessaires!',
  printGuideSupportWarningMessage: `
  Il s'agit d'un guide général, car je ne peux pas fournir de récapitulatif sur chaque combinaison imprimante/firmware.<br/>
  Je recommande de faire d'abord un petit test d'impression. Si vous rencontrez des problèmes pour que cela fonctionne, veuillez rechercher en ligne si votre modèle d'imprimante spécifique prend en charge la commande G-CODE <strong>M600</strong> pour changer de filament.<br/>`,
  printGuideGenerateQRCode: 'Generation du QR code',
  printGuideGenerateQRCodeSteps: `
  <li>Sélectionnez le type de QR Code que vous souhaitez générer dans "Options de QR Code".</li>
  <li>Remplissez les champs nécessaires.</li>
  <li>Configurez le modèle 3D dans "Options du modèle 3D".</li>
  <li>Cliquez sur "Générer un modèle 3D"</li>
  <li>Enregistrez le fichier stl via le bouton "Enregistrer en STL" en haut à droite.</li>`,
  printGuideVersionDisclaimer: 'Version {version}, votre expérience peut différer.',
  // Cura
  printGuideCuraStep1: `
  Découpez le modèle et localisez la couche où le changement de couleur doit se produire.<br/>
  Dans mon cas, c'est à la couche 16.<br/>`,
  printGuideCuraStep2: `
  <li>Allez dans "Extensions -> Post Traitement -> Modifier le G-Code".</li>
  <li>Cliquez sur "Ajouter un script" puis sélectionnez "Filament Change".</li>
  <li>Dans les paramètres de changement de filament, définissez la valeur "Layer" sur votre numéro de couche définie à l'étape 1.</li>
  <li>Re-Découpez votre modèle. L'icône à gauche du bouton "Découper" indique un script de post-traitement actif.</li>`,
  // PrusaSlicer
  printGuidePrusaSlicerStep1: `
  Découpez le modèle et localisez la couche où le changement de couleur doit se produire.<br/>
  Dans mon cas, c'est à la couche 11.<br/>`,
  printGuidePrusaSlicerStep2: `
  <li>Cliquez sur le petit signe plus, à droite de la barre de sélection des couches.</li>
  <li>PrusaSlicer vous donne un bel aperçu où vous pouvez voir les différentes couleurs pour vérifier que vous avez sélectionné le bon calque. Les parties du QR Code doivent avoir une couleur différente de la base</li>
  <li>Re-Découpez votre modèle.</li>`,
  printGuideStep3: `
  Vous pouvez maintenant imprimer le modèle comme d'habitude.<br/>
  L'imprimante 3D s'arrêtera sur la couche spécifiée et se déplacera à l'origine du plateau d'impression.
  Vous pouvez maintenant échanger le filament et redémarrer le travail d'impression à partir du menu de votre imprimante.`,

  //
  // FAQ Section
  //
  faqTitle: 'Questions Fréquemment Posées',
  faqQuestion1: 'Quels formats de fichiers puis-je exporter?',
  faqAnswer1: 'Vous pouvez exporter vos modèles 3D en fichiers STL (formats binaire et ASCII) pour l\'impression 3D, ou en images PNG pour l\'aperçu.',
  faqQuestion2: 'Quelle est la différence entre les niveaux de correction d\'erreur?',
  faqAnswer2: 'Des niveaux de correction d\'erreur plus élevés rendent le code QR plus résistant aux dommages et aux erreurs de numérisation, mais rendent également le code plus dense avec plus de modules. Pour l\'impression 3D, les niveaux Medium (M) ou Quartile (Q) fonctionnent généralement le mieux.',
  faqQuestion3: 'Pourquoi mon code QR ne se scanne-t-il pas correctement après l\'impression?',
  faqAnswer3: 'Assurez-vous qu\'il y a suffisamment de contraste entre les modules du code QR et la base. Utilisez des filaments de couleurs différentes ou assurez-vous que la différence de hauteur est suffisamment importante. Vérifiez également que la résolution de votre imprimante est suffisante pour la taille du code QR.',
  faqQuestion4: 'Mon code QR continuera-t-il à fonctionner pour toujours ou expire-t-il?',
  faqAnswer4: 'Le code QR généré lui-même continuera à fonctionner pour toujours. Cependant, si vous utilisez le code QR pour créer un lien vers une page externe, le lien peut cesser de fonctionner avec le temps. Ceci est hors de notre contrôle. Si c\'est une page qui vous appartient, assurez-vous que le lien reste en ligne. Si c\'est une page tierce et qu\'ils mettent à jour leur site, le lien peut cesser de fonctionner. Vous pouvez utiliser un raccourcisseur d\'URL qui vous permet de changer le lien de destination après la création. Les codes Spotify fonctionneront jusqu\'à ce que Spotify arrête cette fonctionnalité.',
  faqQuestion5: 'Comment puis-je imprimer des codes QR avec mon imprimante 3D multicolore?',
  faqAnswer5: 'Lors de l\'exportation du code QR, sélectionnez l\'option pour télécharger le modèle 3D en plusieurs parties. Cette option se trouve en haut de la page, directement à gauche du bouton d\'exportation STL. Cela crée un fichier zip contenant toutes les différentes parties du modèle 3D. Chargez toutes les parties dans votre trancheur et superposez-les les unes sur les autres. Maintenant, vous pouvez assigner des couleurs aux différentes parties dans votre trancheur. Vous pouvez également créer un code QR imprimé d\'aspect 2D en réglant la valeur de hauteur de votre code QR sur un réglage très bas (par exemple, 0,1 mm). Veuillez vérifier l\'aperçu dans votre trancheur pour vous assurer que tout fonctionne comme prévu.',
  faqQuestion6: 'Comment puis-je générer plusieurs codes QR à la fois?',
  faqAnswer6: 'Utilisez la fonction Mode Batch! Cliquez sur le bouton "Mode Batch" dans la section Options du code QR. Configurez d\'abord vos paramètres par défaut dans le formulaire principal. Ensuite, téléchargez le modèle CSV, remplissez-le avec vos données (un code QR par ligne) et téléversez-le. L\'outil générera tous les codes QR et les empaquetera dans un fichier ZIP à télécharger. Vous pouvez personnaliser chaque code QR en remplissant la colonne correspondante, ou laisser les cellules vides pour utiliser vos paramètres par défaut. Survolez n\'importe quel libellé dans le formulaire principal pour voir son nom de champ à utiliser dans le CSV.',

  // FAQ Footer
  faqFooter: 'Si vous avez des questions supplémentaires, n\'hésitez pas à me contacter et je les ajouterai à la liste:',
  faqContact: 'Envoyez-moi un e-mail avec votre question',

  //
  // Mode Batch
  //
  batchMode: 'Mode Batch',
  batchModeDescription: 'Générez plusieurs QR codes à partir d\'un fichier CSV. Chaque ligne du CSV créera un fichier STL séparé.',
  batchHowToTitle: 'Comment utiliser le Mode Batch:',
  batchStep1: 'Configurez d\'abord vos paramètres QR code dans le formulaire principal (type de contenu, options du modèle, etc.). Ceux-ci seront utilisés par défaut.',
  batchStep2: 'Téléchargez le modèle CSV ci-dessous. Il contient tous les champs disponibles pour votre type de contenu sélectionné.',
  batchStep3: 'Remplissez le CSV avec vos données. Chaque ligne devient un QR code. Laissez les cellules vides pour utiliser vos paramètres par défaut.',
  batchStep4: 'Téléchargez le fichier CSV et cliquez sur "Générer tout" pour créer vos QR codes dans une archive ZIP.',
  batchTips: 'Conseils:',
  batchTip1: 'Survolez n\'importe quel libellé dans le formulaire principal pour voir son nom de champ (ex: "base.width", "code.depth").',
  batchTip2: 'Ajoutez une colonne "filename" pour personnaliser les noms de fichiers de sortie (sans extension .stl).',
  batchTip3: 'Le CSV peut utiliser soit la virgule (,) soit le point-virgule (;) comme délimiteur.',
  batchTemplateDownload: 'Étape 1: Télécharger le modèle CSV',
  batchTemplateHelp: 'Téléchargez un fichier modèle CSV avec tous les champs disponibles pour le type de contenu actuellement sélectionné. Le modèle inclut une ligne d\'exemple avec vos paramètres actuels.',
  downloadCsvTemplate: 'Télécharger le modèle',
  uploadCsvFile: 'Étape 2: Téléverser le fichier CSV',
  chooseFile: 'Choisir un fichier...',
  noFileSelected: 'Aucun fichier sélectionné',
  batchLargeWarning: 'Vous êtes sur le point de générer {count} QR codes. Cela peut prendre du temps et utiliser beaucoup de mémoire. Envisagez de diviser en lots plus petits si vous rencontrez des problèmes.',
  batchPreview: 'Aperçu',
  batchShowingRows: 'affichage de {shown} sur {total} lignes',
  batchMoreRows: '...et {count} lignes de plus',
  batchValidation: 'Validation',
  batchValidRows: 'Lignes valides',
  batchInvalidRows: 'Lignes invalides (seront ignorées)',
  batchProcessing: 'Génération des QR Codes...',
  batchProgress: 'Traitement de {current} sur {total}',
  batchCurrentItem: 'Actuel',
  batchGenerate: 'Générer tout',
  batchAbort: 'Annuler',
  batchDownloadZip: 'Télécharger ZIP',
  batchStartNew: 'Nouveau lot',
  batchSuccessCount: '{count} QR code(s) générés avec succès!',
  batchErrorCount: 'Échec de génération de {count} QR code(s)',
  batchRowError: 'Ligne {row}: {error}',
  batchMoreErrors: '...et {count} erreurs de plus',
  batchParseError: 'Erreur lors de l\'analyse du CSV',
  batchFileReadError: 'Erreur lors de la lecture du fichier',
  batchNoDataRows: 'Le fichier CSV doit contenir au moins une ligne d\'en-tête et une ligne de données',
  batchMissingRequiredField: 'Le CSV doit contenir au moins une de ces colonnes: {fields}',
  batchEmptyQRText: 'Contenu QR code vide',
  cancel: 'Annuler',
  close: 'Fermer',
  or: 'ou',

  //
  // Import/Export Paramètres
  //
  importExportSettings: 'Importer/Exporter les paramètres',
  exportSettings: 'Exporter les paramètres',
  exportSettingsDescription: 'Copiez ou téléchargez vos paramètres actuels au format JSON pour les partager ou les sauvegarder.',
  importSettings: 'Importer les paramètres',
  importSettingsDescription: 'Collez ou chargez un fichier JSON de paramètres pour appliquer les paramètres enregistrés.',
  copyToClipboard: 'Copier dans le presse-papiers',
  downloadAsFile: 'Télécharger comme fichier',
  loadFromFile: 'Charger depuis un fichier',
  applySettings: 'Appliquer les paramètres',
  pasteJsonHere: 'Collez les paramètres JSON ici...',
  copiedToClipboard: 'Copié dans le presse-papiers!',
  settingsApplied: 'Paramètres appliqués avec succès!',
  invalidJsonError: 'Format JSON invalide',
};
