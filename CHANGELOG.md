# Changelog
All notable changes to this project will be documented in this file.

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
