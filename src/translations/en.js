export default {
  //
  //  Local name of the language
  //
  languageLocalName: 'English',

  //
  // General
  //
  title: '3D Code Generator',
  subtitle: 'Export QR codes or Spotify codes as STL for 3D printing',
  preview: 'Preview',
  controlsHint: 'Use your mouse to rotate',
  changeLanguage: 'Change Language',
  contributeTranslation: 'Contribute a translation',
  generateButton: 'Generate 3D Model',
  scrollDownForGuide: 'Scroll down for a guide on how to print your QR code.',
  printabilityWarning: 'Warning for 3D printability',
  printabilityWarningBody: 'At least one edge of the smallest element in the 3D model is very small: {dimensions}. Depending on your setup, this could make printing harder.',
  supportMe: 'Support qrcode2stl',
  viewOnGithub: 'GitHub',
  shareButtonTitle: 'Share this page',
  file: 'file',
  no: 'no',
  yes: 'yes',
  top: 'top',
  bottom: 'bottom',
  left: 'left',
  right: 'right',
  content: 'content',
  min: 'min',
  max: 'max',
  thankYou: 'Thank you very much for the support. You rock!',
  promotionTitle: 'Want to start a new hobby? Looking for a second/third 3d printer?',
  promotionSubtitle: 'Here are some recommended 3d printers and 3d printer accessories to get you covered. If you want to support the development of this tool please consider using the links below to buy on AliExpress.',
  corner: 'corner',
  isGenerating: 'Generating 3D Model...',
  copyExistingQRCode: 'Copy an existing QR Code',
  holdQRCodeInView: 'Hold the QR Code into view of the camera',
  decodedQRCodeData: 'Decoded QR Code data',

  //
  // QR Code Options Panel
  //
  qrCodeOptionsTitle: 'QR Code Options',
  qrCodeTextPlaceholder: 'The text for your QR code e.g. Hello World or https://flxn.de',
  errorCorrection: 'Error Correction',
  errorCorrectionHelp: 'The higher the error correction level, the denser the QR code.',
  useEscapeSequences: 'Escape sequences',
  useEscapeSequencesToggle: 'Interpret escape sequences',
  useEscapeSequencesHelp: 'Examples: \\n (newline), \\t (tab), \\r (carriage return)',
  optionalFieldsHint: 'Not all fields have to be filled in.',
  // Wifi
  ssidPlaceholder: 'The name of the Wifi network',
  password: 'Password',
  passwordPlaceholder: 'The password of the Wifi network',
  security: 'Security',
  hidden: 'Hidden',
  hiddenText: 'SSID is hidden',
  // Contact
  contact: 'Contact',
  yourName: 'Your Name',
  firstname: 'Firstname',
  lastname: 'Lastname',
  organization: 'Organization',
  role: 'Role',
  numbers: 'Numbers',
  cellphone: 'Cellphone',
  phone: 'Phone',
  street: 'Street',
  city: 'City',
  state: 'State',
  // E-Mail
  recipient: 'Recipient',
  recipientPlaceholder: 'The address that sould receive the mail',
  subject: 'Subject',
  subjectPlaceholder: 'The e-mail subject line',
  body: 'Body',
  bodyPlaceholder: 'The e-mail content',
  // SMS
  phonePlaceholder: 'The phone number of the recipient',
  smsMessage: 'Message',
  smsMessagePlaceholder: 'The SMS message',
  // Calendar
  calendar: 'Calendar',
  eventName: 'Event Name',
  eventNamePlaceholder: 'Name of the event',
  startDate: 'Start Date',
  startTime: 'Start Time',
  endDate: 'End Date',
  endTime: 'End Time',
  allDay: 'All Day',
  allDayEvent: 'All day event',
  location: 'Location',
  locationPlaceholder: 'Event location (optional)',
  description: 'Description',
  descriptionPlaceholder: 'Event description (optional)',

  //
  // Spotify Options Panel
  //
  spotifyOptions: 'Spotify Code Options',
  spotifyUri: 'Spotify URI/Link',
  spotifyUriHelp: 'You can get the Spotify URI for a track/album/playlist/user from Spotify by clicking "Share" and then "URI".',
  spotifyCodeHeightInfo: 'Spotify Codes have a fixed aspect ratio of 4:1',

  //
  // 3D Model Options Panel
  //
  modelOptions: '3D Model Options',
  base: 'Base',
  width: 'Width',
  height: 'Height',
  depth: 'Depth',
  cornerRadius: 'Corner Radius',
  border: 'Border',
  borderAroundBase: 'Add border around the base',
  margin: 'Margin',
  block: 'Block',
  style: 'Style',
  shape: 'Shape',
  rectangle: 'rectangle',
  roundedRectangle: 'rounded rectangle',
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
  customIcon: 'Custom Icon',
  uploadCustomIcon: 'Upload Custom Icon',
  selectSvgFile: 'Select SVG file',
  customIconUploaded: 'Custom icon uploaded successfully',
  invalidSvgFile: 'Invalid SVG file. Please select a valid SVG file.',
  iconUploadError: 'Error uploading icon. Please try again.',
  iconSizeHelp: `
  The size of the icon relative to the total width of the QR Code.
  The icon abuses the inbuilt error correction of the qr code. If it is too big the code may not be readable.
  If you want to have a big icon but your phone can't read the QR code you can try to increase the Error Correction Level.`,
  text: 'Text',
  textOnEdge: 'Add a custom title text to your QR code.',
  placement: 'Placement',
  theText: 'Regular line\n*Italic line*\n**Bold line**\n***Italic & Bold line***',
  fontInfoText: 'Change the font for individual lines:',
  italicInfoText: '*italics*',
  boldInfoText: '**bold**',
  cityMode: 'QR-City',
  cityModeText: 'Randomly alters the height of the blocks.',
  invert: 'Invert',
  invertText: 'Inverts the structure of the code',
  keychain: 'Keychain',
  keychainHelp: 'Attach hole to the side of the tag (e.g. to attach it to your keychain).',
  mirrorHoles: 'Mirror Holes',
  mirrorHolesHelp: 'Mirror the holes to the opposite side (e.g. to fix it with screws).',
  keychainHoleDiameter: 'Hole Diameter',
  keychainMaterialThickness: 'Material Thickness',
  keychainOffset: 'Protrusion Offset',
  nfcIndentation: 'NFC/RFID',
  nfcIndentationHelp: 'Adds an indentation on the bottom side of the base where one can insert an NFC/RFID tag.',
  indentation: 'Indentation',
  nfcIndentationHiddenHelp: 'Creates a cavity inside the base with a 1mm offset from the bottom of the base. This allows you to firmly embed the NFC tag inside the 3d print itself. Pause printing before the closing layer, insert the tag, then resume printing. Make sure that the indentation depth is slightly larger than the tag itself and adjust base depth accordingly.',
  compatibilityMode: 'Compatibility Mode',
  compatibilityModeLabel: 'Old Model Generation (when having problems, e.g. in TinkerCAD)',
  compatibilityModeHelp: 'I recently made an improvement that increases the speed of the model generation. If you are having problems with the generated model, you can try to enable this option. It will generate the model in the old way, which may fix some issues with your slicer/CAD software. This also affects icon processing - complex icon shapes may be simplified for better compatibility.',
  iconCompatibilityWarning: 'TinkerCAD compatibility mode active',
  iconShapesSimplified: 'icon shapes have been simplified',
  iconHolesRemoved: 'icon holes have been removed',
  iconCompatibleProcessing: 'using TinkerCAD-compatible processing might result in icon simplification. Disable if icon rendering isn\'t what you expected',
  monochromeLogoInfo: 'For best results, please upload monochrome (black and white) logos. Multi-color logos may not work properly with QR code generation.',

  //
  // Export Settings
  //
  exportTypeHelp: 'Just leave this as "binary" to keep file size low. If your software has issues with the generated file, you can try to change this option.',
  exportSeparatePartsHelp: 'If set to "yes" the base and the qr code will be saved as two separate parts for printers with dual extrusion printing. Your browser may ask for permissions to download multiple files.',
  separateParts: 'Separate parts',
  saveAsButton: 'Export to STL',
  saveAsImageButton: 'Render to PNG',

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

  //
  // FAQ Section
  //
  faqTitle: 'Frequently Asked Questions',
  faqQuestion1: 'What file formats can I export?',
  faqAnswer1: 'You can export your 3D models as STL files (both binary and ASCII formats) for 3D printing, or as PNG images for previewing.',
  faqQuestion2: 'What\'s the difference between error correction levels?',
  faqAnswer2: 'Higher error correction levels make the QR code more resistant to damage and scanning errors, but also make the code denser with more modules. For 3D printing, Medium (M) or Quartile (Q) levels usually work best.',
  faqQuestion3: 'Why does my QR code not scan properly after printing?',
  faqAnswer3: 'Make sure there\'s enough contrast between the QR code modules and the base. Use different colored filaments or ensure the height difference is significant enough. Also check that your printer\'s resolution is sufficient for the QR code size.',
  faqQuestion4: 'Will my QR Code keep working forever or does it expire?',
  faqAnswer4: 'The generated QR code itself will continue to work forever. However, if you\'re using the QR code to link to an external page, the link may break over time. This is out of our control. If it\'s a page you own, make sure the link stays online. If it\'s a third-party page and they update their site, the link may stop working. You can use a URL shortener that allows you to change the destination link after creation. Spotify codes will work until Spotify discontinues this feature.',
  faqQuestion5: 'How can I print QR codes with my multicolor 3D printer?',
  faqAnswer5: 'When exporting the QR code, select the option to download the 3D model in multiple parts. This option is located at the top of the page, directly to the left of the STL export button. This creates a zip file containing all the different parts of the 3D model. Load all parts into your slicer and overlay them on top of each other. Now you can assign colors to the different parts in your slicer. You can also create a 2D-looking printed QR code by setting the height value of your QR code to a very low setting (e.g., 0.1mm). Please check the preview in your slicer to ensure everything works as expected.',
  faqQuestion6: 'How can I generate multiple QR codes at once?',
  faqAnswer6: 'Use the Batch Mode feature! Click the "Batch Mode" button in the QR Code Options section. First, configure your default settings in the main form. Then download the CSV template, fill it with your data (one QR code per row), and upload it. The tool will generate all QR codes and package them into a ZIP file for download. You can customize each QR code by filling in the corresponding column, or leave cells empty to use your default settings. Hover over any label in the main form to see its field name for use in the CSV.',

  // FAQ Footer
  faqFooter: 'If you have any additional questions, feel free to contact me and I will add them to the list:',
  faqContact: 'Send me an email with your question',

  //
  // Batch Mode
  //
  batchMode: 'Batch Mode',
  batchModeDescription: 'Generate multiple QR codes at once. Choose Simple mode for quick text-only QR codes, or Advanced mode for full CSV customization.',
  batchModeType: 'Mode',
  batchModeSimple: 'Simple',
  batchModeAdvanced: 'Advanced (CSV)',
  batchModeSimpleHelp: 'Enter one QR code text per line. All other settings (size, style, etc.) will use your current configuration.',
  batchModeAdvancedHelp: 'Upload a CSV file with full control over each QR code\'s settings. Use the template to see available fields.',
  batchSimpleHowToTitle: 'How to use Simple Mode:',
  batchSimpleStep1: 'Configure your QR code appearance in the main form (size, border, text, etc.).',
  batchSimpleStep2: 'Enter one QR code text per line in the textarea below.',
  batchSimpleStep3: 'Click "Generate All" to create your QR codes as a ZIP archive.',
  batchSimpleTextareaLabel: 'QR Code Texts (one per line)',
  batchSimpleTextareaPlaceholder: 'https://example.com/page1\nhttps://example.com/page2\nHello World\n...',
  batchSimpleTextareaHelp: '{count} QR code(s) will be generated',
  batchHowToTitle: 'How to use Advanced Mode:',
  batchStep1: 'First, configure your QR code settings in the main form (content type, model options, etc.). These will be used as defaults.',
  batchStep2: 'Download the CSV template below. It contains all available fields for your selected content type.',
  batchStep3: 'Fill in the CSV with your data. Each row becomes one QR code. Leave cells empty to use your default settings.',
  batchStep4: 'Upload the CSV file and click "Generate All" to create your QR codes as a ZIP archive.',
  batchTips: 'Tips:',
  batchTip1: 'Hover over any label in the main form to see its field name (e.g., "base.width", "code.depth").',
  batchTip2: 'Add a "filename" column to customize output file names (without .stl extension).',
  batchTip3: 'The CSV can use either comma (,) or semicolon (;) as delimiter.',
  batchTemplateDownload: 'Step 1: Download CSV Template',
  batchTemplateHelp: 'Download a template CSV file with all available fields for the currently selected content type. The template includes an example row with your current settings.',
  downloadCsvTemplate: 'Download Template',
  uploadCsvFile: 'Step 2: Upload CSV File',
  chooseFile: 'Choose a file...',
  noFileSelected: 'No file selected',
  batchLargeWarning: 'You are about to generate {count} QR codes. This may take a while and use significant memory. Consider splitting into smaller batches if you experience issues.',
  batchPreview: 'Preview',
  batchShowingRows: 'showing {shown} of {total} rows',
  batchMoreRows: '...and {count} more rows',
  batchValidation: 'Validation',
  batchValidRows: 'Valid rows',
  batchInvalidRows: 'Invalid rows (will be skipped)',
  batchProcessing: 'Generating QR Codes...',
  batchProgress: 'Processing {current} of {total}',
  batchCurrentItem: 'Current',
  batchGenerate: 'Generate All',
  batchAbort: 'Abort',
  batchDownloadZip: 'Download ZIP',
  batchStartNew: 'Start New Batch',
  batchSuccessCount: 'Successfully generated {count} QR code(s)!',
  batchErrorCount: 'Failed to generate {count} QR code(s)',
  batchRowError: 'Row {row}: {error}',
  batchMoreErrors: '...and {count} more errors',
  batchParseError: 'Error parsing CSV',
  batchFileReadError: 'Error reading file',
  batchNoDataRows: 'CSV file must contain at least a header row and one data row',
  batchMissingRequiredField: 'CSV must contain at least one of these columns: {fields}',
  batchEmptyQRText: 'Empty QR code content',
  batchDownloadCountdown: 'Your download will start in {seconds} seconds.',
  batchDownloadStarting: 'Your download will start now.',
  batchThankYou: 'Thank You for using qrcode2stl.',
  batchAdblockMessage: 'Ads are annoying, I know. But they help me to pay the bills so I can keep the site running and continue the development. If you can\'t afford to donate, maybe consider disabling your AdBlocker for this site.',
  cancel: 'Cancel',
  close: 'Close',
  or: 'or',

  //
  // Import/Export Settings
  //
  importExportSettings: 'Import/Export Settings',
  exportSettings: 'Export Settings',
  exportSettingsDescription: 'Copy or download your current settings as JSON to share or backup.',
  importSettings: 'Import Settings',
  importSettingsDescription: 'Paste or load a JSON settings file to apply saved settings.',
  copyToClipboard: 'Copy to Clipboard',
  downloadAsFile: 'Download as File',
  loadFromFile: 'Load from File',
  applySettings: 'Apply Settings',
  pasteJsonHere: 'Paste JSON settings here...',
  copiedToClipboard: 'Copied to clipboard!',
  settingsApplied: 'Settings applied successfully!',
  invalidJsonError: 'Invalid JSON format',
};
