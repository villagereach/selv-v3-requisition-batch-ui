FROM debian:jessie

WORKDIR /selv-v3-requsition-batch-ui

COPY package.json .
COPY package-yarn.json .
COPY config.json .
COPY src/ ./src/
COPY build/messages/ ./messages/
