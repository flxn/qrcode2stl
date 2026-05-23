FROM node:iron-trixie-slim AS build

WORKDIR /usr/src/app

RUN set -ex \
  && apt-get update \
  && apt-get -y install \
    autotools-dev \
  	automake \
	&& apt-get clean \
  && rm -rf /var/lib/apt/lists/*

COPY . .

RUN npm install && npm install http-server && npm run build

FROM node:iron-trixie-slim AS runtime

WORKDIR /usr/app

RUN npm install -g http-server
COPY --from=build /usr/src/app/dist/ www/

EXPOSE 8080
CMD [ "http-server", "www" ]
