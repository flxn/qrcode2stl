#!/bin/bash
npm run build && rsync -avz --delete dist/ flxn:/var/www/qrcode2stl
