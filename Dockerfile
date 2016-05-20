# to build:
# docker build -t="vizit:v1" .
#
# to test:
# docker run -t -i --rm --user=netuser --net=none --cap-drop all vizit:v1 bash
#
# remember --rm or else stale old containers will be left around!
# use "docker ps -a" to see all containers

# don't use 'latest' tag since that might change
FROM node:6
MAINTAINER Jason Unger <jasonscottunger@gmail.com>

# JS and Python backends
RUN mkdir /tmp/javascript

# IMPORTANT: make sure to run 'npm install' in backends/javascript first
# to install the proper node modules inside of here via npm before
# creating this Docker container, since it's a pain to install npm and
# modules within the container.

ADD ptjavascript /tmp/javascript

RUN useradd netuser
