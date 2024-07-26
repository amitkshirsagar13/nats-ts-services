FROM mcr.microsoft.com/devcontainers/typescript-node:1-22-bookworm

COPY scripts/executables/linux/nsc /usr/local/bin/nsc
COPY scripts/executables/linux/nats /usr/local/bin/nats
COPY scripts/executables/linux/just /usr/local/bin/just

RUN curl -sf https://binaries.nats.dev/nats-io/nats-server/v2@latest | sudo sh
RUN curl -s https://packagecloud.io/install/repositories/github/git-lfs/script.deb.sh | sudo bash
RUN apt install git-lfs -y \
	&& apt-get clean