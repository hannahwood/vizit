# to build:
# docker build -t="jasonunger/vizit:v1" .
#
# to test:
# docker run -t -i --rm --user=netuser --net=none --cap-drop all jasonunger/vizit:v1 bash
#
# remember --rm or else stale old containers will be left around!
# use "docker ps -a" to see all containers

FROM node:6
MAINTAINER Jason Unger <jasonscottunger@gmail.com>

RUN mkdir /tmp/javascript
WORKDIR -p /tmp/javascript

COPY ptjavascript/package.json /tmp/javascript
RUN npm install

ADD ptjavascript /tmp/javascript

RUN useradd netuser
