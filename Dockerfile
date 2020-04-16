FROM node:lts-buster-slim

WORKDIR /usr/src/app

RUN apt-get update && apt-get -y install \
	git-core \
	autotools-dev \
	automake \
	&& apt-get clean && rm -rf /var/lib/apt/lists/*

RUN git clone --single-branch --depth 1 https://github.com/flxn/qrcode2stl.git .

RUN npm install && npm install -g http-server && npm run build

RUN mkdir www && mv dist/ www/qrcode2stl/

EXPOSE 8080
CMD [ "http-server", "www" ]
