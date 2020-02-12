export default {
  //
  //  Local name of the language
  //
  languageLocalName: 'Français',

  //
  // General
  //
  title: 'Générateur de QR Code',
  subtitle: 'Exportez votre code QR en STL pour l\'impression 3D',
  preview: 'Aperçu',
  controlsHint: 'Utilisez votre souris pour faire pivoter',
  changeLanguage: 'Changer la Langue',
  contributeTranslation: 'Contribuer une traduction',
  generateButton: 'Générer un modèle 3D',
  scrollDownForGuide: 'Faites défiler vers le bas pour voir comment imprimer votre code QR.',
  printabilityWarning: 'Avertissement pour imprimabilité 3D',
  printabilityWarningBody: 'Au moins un bord du plus petit élément du modèle 3D est très petit: {dimensions}. Selon votre configuration, cela pourrait rendre l\'impression plus difficile.',
  supportMe: 'Me soutenir',
  viewOnGithub: 'Voir sur GitHub',
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
  hiddenText: 'Le SSID est caché',
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
  textOnEdge: 'Ajoutez un texte de titre personnalisé à votre QR Code.',
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

};
