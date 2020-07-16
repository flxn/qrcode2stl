#!/bin/bash
yarn run build && rsync -avz --delete dist/ flxn:/var/www/qrcode2stl
