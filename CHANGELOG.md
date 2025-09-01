# Changelog
All notable changes to this project will be documented in this file.

## [1.16.0] - 2025-08-31

- Fixed multi-part ASCII STL export producing empty files in ZIP.

## [1.15.0] - 2025-08-29

### Added
- New icons.
- Translated message for the Compatibility Mode setting.

### Changed
- Upgraded THREE.js from 0.118.3 to r178 and three-csg-ts from 2.3.0 to 3.2.0 for compatibility.
- Migrated deprecated APIs: replaced `THREE.Geometry` with `BufferGeometry`, removed `fromGeometry()` calls, switched imports to the `/addons/` structure, and updated `BufferGeometryUtils.mergeGeometries` usage.
- Updated text extrusion parameter: old `TextGeometry` height option migrated to `depth`.

### Fixed
- SVG icons with holes now render correctly (e.g., snapchat, spotify, youtube, key, whatsapp, marker) by using proper `SVGLoader.createShapes()` handling for compound shapes with holes.
- Corrected rendering of shapes-within-shapes (overlapping positive/negative areas).
- Fixed icons appearing off-center.
- Fixed the Compatibility Mode switch behavior and icon handling when enabled.
- Resolved an `undefined` variable `shapes` error.

### Contributors
- Thank you [Thibault](https://github.com/clawfire) for the PR!

## [1.14.0] - 2025-06-20

- There seems to be a problem with the faster 3D model generation step when importing the STL into certain CAD software like TinkerCAD. I added a new "compatibility mode" option that uses the old 3D model generation step which should fix the problem. You can enable it in the settings.

## [1.13.0] - 2025-06-18

### Added
- Generate Calendar (iCal) events from QR Codes
- FAQ Section with answers to common questions, if you have any more questions feel free to contact me and I will add them to the FAQ
### Fixed
- Huge performance improvements for the 3D model generation step when not using the inversion feature

## [1.12.0] - 2024-11-06
🚀 Thank You [Plasmics](https://plasmics.com) for sponsoring this update.

### Added
- Option to add text to the left and right of the qr code
- Export as PNG
### Fixed
- Improved top and bottom text behaviour

## [1.11.0] - 2024-03-16
First new update in three years 🥳
### Fixed
- Improved support for international spotify links
- Removed stupid broken Aliexpress promo links

## [1.10.0] - 2021-07-29
### Added
- 📷 You can now scan an existing QR Code using your webcam and create a 3D copy!

## [1.9.0] - 2021-06-21
### Added
- ✍ You can now skip the QR Code and just create a text tag!

## [1.8.1] - 2021-05-18
### Added
- New language option: Czech. Thank You *Denny005*

## [1.8.0] - 2021-02-17
### Added
- 📃 Support for multiline text: Add as many lines as you want and change the text alignment. You can also apply a different font styling for each line! Lines that are too long will automatically overflow into the next line.

## [1.7.0] - 2021-01-04
**Happy 2021 🥳**
qrcode2stl is now one year old! I started working on the first version in early january 2020 and [posted it publicly](https://www.reddit.com/r/3Dprinting/comments/ergng8/inspired_by_all_the_qr_codes_lately_i_made_a_web/) on Jan 20.
Thank you for the support and feedback!

### Added
- **⚡ qrcode2stl now utilizes Web Workers for the 3d model generation step, which should improve responsiveness and eliminate some crashes!**
- 🖼️ You can now view and download a 2D image of the qr code (right click to save it).
### Changed
- The NFC Tag Indentation now better fits the base. Thank You *N-Schaef*
- The 3D model generation has been changed to work on a binary mask of the qr code instead of the stupid canvas implementation I had before.

## [1.6.0] - 2020-10-29
### Added
- 📶 New NFC feature! Choose the NFC/RFID Indentation feature to add a cutout where you can embed an NFC tag into your QR Code.

## [1.5.1] - 2020-10-13
### Added
- New language option: 🇧🇷 Brazilian Portuguese. Thank You *odfigor*

## [1.5.0] - 2020-09-22
### Added
- Export as separate parts will now create a zip archive containing all necessary STLs instead of saving them individually.
### Fixed
- The STL file for the Keychain attachment hole was missing when exporting as separate parts.

## [1.4.0] - 2020-08-29
### Added
- You can now share a link to qrcode2stl which contains your QR Code data and settings.
  After the 3d model was generated you can just copy the link from your URL bar which contains all the settings that you changed.
  ⚠️ Please be careful when sharing links to QR codes that contain sensitive data ⚠️

## [1.3.2] - 2020-08-17
### Changed
- 🌍 New Domain! The site has been moved from https://flxn.de/qrcode2stl to our new domain https://qrcode2stl.printer.tools. The new place where I will host more 3d printing related tools and resources in the future.
  Go check it out! (Though ther is not much to see yet)

## [1.3.1] - 2020-08-15
### Changed
- You can now set the keychain hole diameter.

### Fixed
- Fixed a bug with the keychain holes on some custom text settings.

## [1.3.0] - 2020-08-15
### Added
- ⛓ A new option to add holes for attaching the QR Code to your keychain or fixing it to a surface with screws.
  You can choose between placement on the left, top and top-left corner.
- A section with links to 3d printers and accessories.

## [1.2.0] - 2020-08-09
### Added
- Added inversion feature to Spotify Codes

### Fixed
- QR Code icons are now correctly inverted

### Changes
- Internal changes in 3D model generation for easier extendability

## [1.1.0] - 2020-08-04
### Added
- 🔃 QR Code blocks can now be inverted. If you choose the option the space around the blocks is extruded so the blocks form holes.
  If you want the top surface to be flush add a border with the same height as the code blocks.
  You can also invert the QR Code and disable the border for a nice look.

### Changed
- Changed the default base shape to a rounded rectangle.

### Removed
- Removed the option to choose a round QR Code block style. It caused problems with the inversion feature and was basically never used.

## [1.0.0] - 2020-07-27
### Added
- 🎵 Added the possibility to create 3d-printable Spotify Codes.
  Add a custom text to your Spotify Code and create 3D printed tags for your favorite playlist to share with your friends at a party.
  If you're an artist yourselves you can give away 3D tags to your Spotify profile to promote your music.
  Click on the new "Spotify Code" Button on the top left to switch from QR Code mode to Spotify mode.
  You can paste in the link to a Spotify track/album/playlist/user or its Spotify URI and the tool will pull the Code to this item from Spotify's server.

## [0.9.1] - 2020-07-24
### Fixed
- 🥳 The long standing bug when slicing with Cura seems to be fixed now.

## [0.9.0] - 2020-07-16
### Added
- Versioning! I bumped the version to 0.9.0 and from now on I will try to follow a consistent versioning scheme for the project.
- A Changelog! The project will also have a changelog where I'll highlight the most important changes for each version.
- A navigation button that shows the current version and on click opens the changelog.
