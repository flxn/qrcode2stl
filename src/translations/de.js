export default {
  //
  //  Local name of the language
  //
  languageLocalName: 'Deutsch',

  //
  // General
  //
  title: '3D Code Generator',
  subtitle: 'Generiere 3D-druckbare QR Codes oder Spotify Codes',
  preview: 'Vorschau',
  controlsHint: 'Benutze die Maus um die Sicht zu ändern',
  changeLanguage: 'Sprache Ändern',
  contributeTranslation: 'Trage eine Übersetzung bei',
  generateButton: 'Generiere 3D Modell',
  scrollDownForGuide: 'Scrolle herunter für eine Druckanleitung.',
  printabilityWarning: '3D-Druck Warnung',
  printabilityWarningBody: `
  Mindestens ein Block im 3D Modell ist sehr kurz: {dimension}.
  Abhängig von deinem 3D-Drucker und dessen Genauigkeit könnte dies den Druck schwerer machen.`,
  supportMe: 'Unterstütze qrcode2stl',
  viewOnGithub: 'GitHub',
  shareButtonTitle: 'Teile diese Seite',
  file: 'Datei',
  no: 'Nein',
  yes: 'Ja',
  top: 'oben',
  bottom: 'unten',
  left: 'links',
  right: 'rechts',
  content: 'Inhalt',
  thankYou: 'Vielen Dank für die Unterstützung. Du rockst!',
  promotionTitle: 'Du willst ins 3D-Druck Hobby einsteigen oder suchst nach einem zweiten/dritten 3D-Drucker?',
  promotionSubtitle: 'Hier sind ein paar meiner Vorschläge für 3D-Drucker und Zubehörteile. Wenn du die Entwicklung dieses Tools unterstützen möchtest, würde ich mich freuen wenn du einen der unten stehenden Links benutzt um auf AliExpress zu bestellen.',
  corner: 'Ecke',
  isGenerating: 'Generiere 3D Modell...',
  headerShareNotice: 'Teile deinen Code mit dieser URL',
  copyExistingQRCode: 'Kopiere einen existierenden QR Code',
  holdQRCodeInView: 'Halte den QR Code in die Kamera',
  decodedQRCodeData: 'QR Code ausgelesen',

  //
  // QR Code Options Panel
  //
  qrCodeOptionsTitle: 'QR Code Optionen',
  qrCodeTextPlaceholder: 'Der text deines QR codes z.B.: Hallo Welt oder https://flxn.de',
  errorCorrection: 'Fehlerkorrektur',
  errorCorrectionHelp: 'Je höher der Grad der Fehlerkorrektur, desto dichter der QR code.',
  optionalFieldsHint: 'Es müssen nicht alle Felder befüllt werden.',
  // Wifi
  ssidPlaceholder: 'Der Name des Wifi-Netzwerks',
  password: 'Passwort',
  passwordPlaceholder: 'Das Passwort des Wifi-Netzwerks',
  security: 'Verschlüsselung',
  hidden: 'Versteckt',
  hiddenText: 'SSID ist versteckt',
  // Contact
  contact: 'Kontakt',
  yourName: 'Dein Name',
  firstname: 'Vorname',
  lastname: 'Nachname',
  organization: 'Organisation',
  role: 'Rolle',
  numbers: 'Nummern',
  cellphone: 'Mobil',
  phone: 'Telefon',
  street: 'Straße',
  city: 'Stadt',
  state: 'Bundesland',
  // E-Mail
  recipient: 'Empfänger',
  recipientPlaceholder: 'Die E-Mail-Adresse des Empfängers',
  subject: 'Betreff',
  subjectPlaceholder: 'Der Betreff der E-Mail',
  body: 'Text',
  bodyPlaceholder: 'Der Inhalt der E-Mail',
  // SMS
  phonePlaceholder: 'Die Telefonnummer des Empfängers',
  smsMessage: 'Nachricht',
  smsMessagePlaceholder: 'Die SMS-Nachricht',
  // Calendar
  calendar: 'Kalender',
  eventName: 'Ereignisname',
  eventNamePlaceholder: 'Name des Ereignisses',
  startDate: 'Startdatum',
  startTime: 'Startzeit',
  endDate: 'Enddatum',
  endTime: 'Endzeit',
  allDay: 'Ganztägig',
  allDayEvent: 'Ganztägiges Ereignis',
  location: 'Ort',
  locationPlaceholder: 'Veranstaltungsort (optional)',
  description: 'Beschreibung',
  descriptionPlaceholder: 'Ereignisbeschreibung (optional)',

  //
  // Spotify Options Panel
  //
  spotifyOptions: 'Spotify Code Optionen',
  spotifyUri: 'Spotify URI/Link',
  spotifyUriHelp: 'Du bekommst die Spotify URI für ein Lied/Album/Playlist/User indem du auf "Teilen" und dann "URI" klickst.',
  spotifyCodeHeightInfo: 'Spotify Codes haben ein festes Seitenverhätnis von 4:1',

  //
  // 3D Model Options Panel
  //
  modelOptions: '3D Modell Optionen',
  base: 'Grundplatte',
  width: 'Breite',
  height: 'Höhe',
  depth: 'Tiefe',
  cornerRadius: 'Eckradius',
  border: 'Rahmen',
  borderAroundBase: 'Rahmen um die Basis hinzufügen',
  margin: 'Abstand',
  block: 'Block',
  style: 'Stil',
  shape: 'Form',
  rectangle: 'Rechteck',
  roundedRectangle: 'abgerundetes Rechteck',
  square: 'quadratisch',
  round: 'rund',
  size: 'Größe',
  blockSizeHelp: `
  Diese Einstellung ändert die Größe der einzelnen QR Code Blöcke.
  Du kannst mit diesem Wert herumspielen um das Aussehen des QR Codes zu verändern, aber beachte, dass dies die Lesbarkeit des QR Codes beeinträchtigen könnte.
  Überprüfe, ob du den QR Code scannen kannst bevor du ihn ausdruckst.
  Lasse diesen Wert auf 100% wenn du dir nicht sicher bist.
  Ein Wert über 100% führt dazu, dass sich die Blöcke miteinander verbinden. Dies könnte dabei helfen, wenn du Probleme hast den Code zu drucken.`,
  icon: 'Icon',
  noIcon: 'Kein Icon',
  iconSizeHelp: `
  Die Größe des Icons relativ zur Breite des QR Codes.
  Um das Icon anzuzeigen wird die Fehlerkorrektur des QR Codes missbraucht. Wenn es zu groß ist, kann der Code evtl. nicht mehr richtig ausgelesen werden.`,
  text: 'Text',
  textOnEdge: 'Füge dem QR Code deinen eigenen Text hinzu.',
  placement: 'Platzierung',
  theText: 'Normale Zeile\n*Kursive Zeile*\n**Fette Zeile**\n***Kursive & fette Zeile***',
  fontInfoText: 'Passe die Schriftart einzelner Zeilen an:',
  italicInfoText: '*kursiv*',
  boldInfoText: '**fett**',
  cityMode: 'QR-City',
  cityModeText: 'Verändert die Höhe der Blöcke zufällig.',
  invert: 'Invertieren',
  invertText: 'Kehrt die Struktur des Codes um',
  keychain: 'Anhänger',
  keychainHelp: 'Fügt ein Loch am Rand hinzu (z.B. für Schlüsselanhänger).',
  mirrorHoles: 'Löcher spiegeln',
  mirrorHolesHelp: 'Spiegelt die Löcher auf die gegenüberliegende Seite (z.B. zur Befestigung mit Schrauben).',
  keychainHoleDiameter: 'Durchmesser des Lochs',
  keychainMaterialThickness: 'Materialstärke',
  keychainOffset: 'Überstand',
  nfcIndentation: 'NFC/RFID',
  nfcIndentationHelp: 'Fügt der Basis eine Einkerbung auf der Unterseite hinzu in der NFC/RFID tags platziert werden können.',
  indentation: 'Einkerbung',
  nfcIndentationHiddenHelp: 'Erstellt eine Aushöhlung im Inneren der Basis mit einem Abstand von 1mm zur Unterseite. Damit kannst du einen NFC Tag fest in den 3D-Druck integrieren. Stoppe den Druckvorgang vor dem Layer in dem die Aushöhlung wieder überdekt wird, platziere den Tag und setze dann den Druck fort. Passe auf, dass die Tiefe etwas höher ist als der tatsächliche Tag und passe die Höhe der Basis entsprechend der Größe des Tags an.',
  compatibilityMode: 'Kompatibilitätsmodus',
  compatibilityModeLabel: 'Alter Modellerstellungsmodus (bei Problemen, z.B. in TinkerCAD)',
  compatibilityModeHelp: `Ich habe kürzlich eine Verbesserung vorgenommen, die die Geschwindigkeit der Modellerstellung erhöht. Wenn du Probleme mit dem generierten Modell hast, kannst du versuchen, diese Option zu aktivieren. Dadurch wird das Modell auf die alte Weise generiert, was eventuelle Probleme mit deinem Slicer/CAD-Programm beheben könnte. Dies betrifft auch die Icon-Verarbeitung - komplexe Icon-Formen können für bessere Kompatibilität vereinfacht werden.`,
  iconCompatibilityWarning: 'TinkerCAD-Kompatibilitätsmodus aktiv',
  iconShapesSimplified: 'Icon-Formen wurden vereinfacht',
  iconHolesRemoved: 'Icon-Löcher wurden entfernt',
  iconCompatibleProcessing: 'TinkerCAD-kompatible Verarbeitung kann zu Icon-Vereinfachung führen. Deaktivieren Sie diese Option, wenn die Icon-Darstellung nicht Ihren Erwartungen entspricht',

  //
  // Export Settings
  //
  exportTypeHelp: `
  Solange du keine Probleme mit deinem Slicer hast lasse diesen Wert auf 'binary' stehen.`,
  exportSeparatePartsHelp: `
  Wenn diese Option aktiviert wird, werden alle Bestandteile des QR Code Modells als einzelne STL Dateien gespeichert. Hilfreich für Drucker mit mehreren Extrudern.`,
  separateParts: 'Separate Teile',
  saveAsButton: 'Als STL exportieren',
  saveAsImageButton: 'Als PNG rendern',

  //
  // Print Guide
  // with HTML Tags included!
  //
  printGuideTitle: '3D Druckanleitung',
  printGuideSubtitle: 'Wie drucke ich einen zweifarbigen QR Code mit nur einem Extruder?',
  printGuideWIPInfo: 'Diese Anleitung befindet sich noch in Arbeit.',
  printGuideIntro: `
  Du kannst auch mit nur einem Extruder mehrfarbige Objekte drucken indem du an den Layern bei denen sich die Farbe ändern soll das Filament von Hand wechselst.<br/>
  So kann man die Grundplatte des QR Codes mit einer Farbe (z.B. weiß) und den tatsächlichen QR Code in einer anderen Farbe (z.B. schwarz) drucken.<br/>
  Nur dadurch ist es möglich einen lesbaren QR Code zu drucken, da nur so der notwendige Kontrast erzeugt werden kann.<br/>
  Der Prozess ist jedoch unterschiedlich je nachdem welchen Slicer du verwendest.<br/>
  In dieser Anleitung beziehe ich mich auf Cura und PrusaSlicer. Wenn du es irgendwie schaffen solltest dabei deinen 3D-Drucker zu beschädigen, trage ich keine Verantwortung dafür.
  `,
  printGuideSupportWarningTitle: 'Bitte beachte: Nicht alle 3D-Druckler/Firmwares unterstützen die notwendigen Funktionen!',
  printGuideSupportWarningMessage: `
  Diese Anleitung erklärt die allgemeinen Schritte, da ich nicht für jede Drucker/Firmware-Kombination einen eigenen Guide schreiben kann.<br/>
  Ich empfehle daher einen kleinen Testdruck zu machen um den Prozess des Filamentwechsels auszuprobieren.<br/>
  Wenn die unten genannte Methode nicht funktionieren sollte und der Drucker nicht anhält um das Filament zu wechseln, suche online ob dein Drucker den <strong>M600</strong> G-Code Befehl unterstützt.`,
  printGuideGenerateQRCode: 'Den QR-Code erzeugen',
  printGuideGenerateQRCodeSteps: `
  <li>Wähle die Art des QR-Codes unter "QR Code Optionen".</li>
  <li>Fülle die notwendigen Felder aus.</li>
  <li>Passe das 3D-Modell unter "3D Model Optionen" an.</li>
  <li>Klicke auf "Generiere 3D Modell"</li>
  <li>Speichere die STL Datei über den Button rechts oben.</li>`,
  printGuideVersionDisclaimer: 'Version {version}, Sprache: Englisch, der Prozess könnte in einer anderen Version abweichen.',
  // Cura
  printGuideCuraStep1: `
  Slice das Modell und identifiziere den Layer an dem der Farbwechsel passieren soll.<br/>
  In gezeigten Fall ist dies Layer 16.<br/>`,
  printGuideCuraStep2: `
  <li>Gehe zu "Extensions -> Post Processing -> Modify G-Code".</li>
  <li>Klicke auf "Add a script" und wähle dann "Filament Change".</li>
  <li>In den Farbwechseleinstellungen setze den Wert für "Layer" auf den Layer aus Schritt 1.</li>
  <li>Slice dein Modell erneut um die Einstellung zu übernehmen. Das Symbol links neben dem "Slice" Button zeigt an, dass ein Post-Processing Skript aktiviert ist.</li>`,
  // PrusaSlicer
  printGuidePrusaSlicerStep1: `
  Slice das Modell und identifiziere den Layer an dem der Farbwechsel passieren soll.<br/>
  In gezeigten Fall ist dies Layer 11.<br/>`,
  printGuidePrusaSlicerStep2: `
  <li>Klicke auf das kleine Plus Symbol rechts des Layer-Auswahl-Schiebers.</li>
  <li>PrusaSlicer zeigt eine nette Vorschau an in dem man die unterschiedlichen Farben sehen kann. Der QR Code sollte hier eine andere Farbe haben als der Boden.</li>
  <li>Slice dein Modell erneut um die Einstellung zu übernehmen.</li>`,
  printGuideStep3: `
  Du kannst nun den Gcode wie gewohnt ausdrucken.<br/>
  Der 3D-Drucker wird an der gewünschten Stelle pausieren und zum Ursprung des Druckbetts fahren.<br/>
  Jetzt kannst du das Filament wechseln und den Druck über das Menü des 3D-Druckers fortsetzen.`,

  //
  // FAQ Section
  //
  faqTitle: 'Häufig gestellte Fragen',
  faqQuestion1: 'Welche Dateiformate kann ich exportieren?',
  faqAnswer1: 'Du kannst deine 3D-Modelle als STL-Dateien (sowohl binär als auch ASCII-Format) für den 3D-Druck oder als PNG-Bilder zur Vorschau exportieren.',
  faqQuestion2: 'Was ist der Unterschied zwischen den Fehlerkorrektur-Leveln?',
  faqAnswer2: 'Höhere Fehlerkorrektur-Level machen den QR-Code resistenter gegen Beschädigungen und Scan-Fehler, machen den Code aber auch dichter mit mehr Modulen. Für den 3D-Druck funktionieren meist Medium (M) oder Quartile (Q) Level am besten.',
  faqQuestion3: 'Warum kann mein QR-Code nach dem Drucken nicht richtig gescannt werden?',
  faqAnswer3: 'Stelle sicher, dass genug Kontrast zwischen den QR-Code-Modulen und der Basis vorhanden ist. Verwende verschiedenfarbige Filamente oder stelle sicher, dass der Höhenunterschied signifikant genug ist. Prüfe auch, ob die Auflösung deines Druckers für die QR-Code-Größe ausreichend ist.',
  faqQuestion4: 'Funktioniert mein QR-Code für immer oder läuft er ab?',
  faqAnswer4: 'Der generierte QR-Code selbst wird für immer funktionieren. Wenn du jedoch den QR-Code verwendest, um auf eine externe Seite zu verlinken, kann der Link mit der Zeit nicht mehr funktionieren. Das liegt außerhalb unserer Kontrolle. Wenn es eine Seite ist, die dir gehört, stelle sicher, dass der Link online bleibt. Wenn es eine Drittanbieter-Seite ist und diese ihre Seite aktualisiert, könnte der Link nicht mehr funktionieren. Du kannst einen URL-Shortener verwenden, der es dir ermöglicht, den Ziel-Link nach der Erstellung zu ändern. Spotify-Codes funktionieren, bis Spotify diese Funktion einstellt.',
  faqQuestion5: 'Wie kann ich QR-Codes mit meinem Mehrfarben-3D-Drucker drucken?',
  faqAnswer5: 'Beim Exportieren des QR-Codes wähle die Option, das 3D-Modell in mehreren Teilen herunterzuladen. Diese Option befindet sich oben auf der Seite, direkt links vom STL-Export-Button. Dies erstellt eine ZIP-Datei mit allen verschiedenen Teilen des 3D-Modells. Lade alle Teile in deinen Slicer und überlagere sie aufeinander. Nun kannst du den verschiedenen Teilen in deinem Slicer Farben zuweisen. Du kannst auch einen 2D-aussehenden gedruckten QR-Code erstellen, indem du die Höhe deines QR-Codes auf einen sehr niedrigen Wert einstellst (z.B. 0,1mm). Bitte überprüfe die Vorschau in deinem Slicer, um sicherzustellen, dass alles wie erwartet funktioniert.',

  // FAQ Footer
  faqFooter: 'Wenn du weitere Fragen hast, kontaktiere mich gerne und ich werde sie zur Liste hinzufügen:',
  faqContact: 'Sende mir eine E-Mail mit deiner Frage',
};
