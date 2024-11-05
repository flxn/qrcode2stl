#!/bin/bash
yarn run build && rsync -avz --delete dist/ root@$(hcloud server ip websites):/var/www/qrcode2stl
