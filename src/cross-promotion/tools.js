/** Sibling tools, shared by the header, discovery cards and footer. */
export const currentTool = 'qrcode2stl';

export const relatedTools = [
  {
    id: 'qrcode2stl', name: 'QRCode2STL', url: 'https://qrcode2stl.printer.tools/',
    icon: '/cross-promo/qrcode2stl-icon.png', image: '/cross-promo/qrcode2stl-screenshot.webp',
    width: 1418, height: 1060, accent: '#24866b', descriptionKey: 'crossPromo.qrcode2stl',
  },
  {
    id: 'businesscard2stl', name: 'Businesscard2STL', url: 'https://businesscard2stl.printer.tools/',
    icon: '/cross-promo/businesscard2stl-icon.png', image: '/cross-promo/businesscard2stl-screenshot.webp',
    width: 1418, height: 1060, accent: '#198b6b', descriptionKey: 'crossPromo.businesscard2stl',
  },
  {
    id: 'coaster2stl', name: 'Coaster2STL', url: 'https://coaster2stl.printer.tools/',
    icon: '/cross-promo/coaster2stl-icon.png', image: '/cross-promo/coaster2stl-screenshot.webp',
    width: 1418, height: 1060, accent: '#e8572f', descriptionKey: 'crossPromo.coaster2stl',
  },
].filter((tool) => tool.id !== currentTool);
