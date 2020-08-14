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
  supportMe: 'Support Me',
  viewOnGithub: 'View on GitHub',
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
  promotionTitle: 'Want to start a new hobby? Looking for a second/third 3d printer? 😉',
  promotionSubtitle: 'Here are some recommended 3d printers and 3d printer accessories to get you covered.',

  //
  // QR Code Options Panel
  //
  qrCodeOptionsTitle: 'QR Code Options',
  qrCodeTextPlaceholder: 'The text for your QR code e.g. Hello World or https://flxn.de',
  errorCorrection: 'Error Correction',
  errorCorrectionHelp: 'The higher the error correction level, the denser the QR code.',
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
