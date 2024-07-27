default:
  @just --list --unsorted

test:
  @npm test

start-nats:
  nats-server -c resolver.conf -m 4443