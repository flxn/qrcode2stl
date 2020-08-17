# qrcode2stl

Create QR codes and download them as \*.stl file for 3d printing.

![The Web App](https://flxn.de/images/qrcode2stl_screenshot.png)

Go to https://printer.tools/qrcode2stl/ to try it out.

Feel free to write an issue if you find a bug or have an idea for a new feature: https://github.com/flxn/qrcode2stl/issues

## Project setup
Install dependencies:
```
yarn
```

Compiles and hot-reload for development:
```
yarn run serve
```

Compiles and minifies for production:
```
yarn run build
```

Lints and fixes files:
```
yarn run lint
```

Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

## Contribute a translation
To add a new translation:
- Create a new file with the corresponding country code under *src/translations/*
  (Example: for french this would be *src/translations/fr.js*)
- Copy the content of the *src/translations/en.js* file into your newly created translation file
- Translate the english strings into your language
- In *src/translations/loader.js* import your new translation and add it to the exported object
