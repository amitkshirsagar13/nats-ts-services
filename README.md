# nats.io TS project

Install nats.io and nsc


### Package Install
```
npm i @types/jest @types/node @types/uuid jest jest-cli jest-junit jest-sonar jest-sonar-reporter mock-spawn ts-node ts-jest tslint typescript
```

### Cleanup Accounts

```
rm -Rf ~/.local/share/nats/nsc
rm -Rf jwt
```

### nsc setup authorization and users
- Create Operator for `nats.io` instance, different instances in cluster can have own operator.

```
nsc add operator --generate-signing-key --sys --name devops
nsc edit operator --require-signing-keys --account-jwt-server-url "nats://auth2.localtest.me:4222"
```
- Create accounts and users
```
nsc add account worker
nsc edit account worker --sk generate
nsc add user --account worker --name worker-service
nsc edit account --name worker --js-mem-storage 256m --js-disk-storage 1g --js-streams 3 --js-consumer 5
nsc push -a worker -u nats://auth2.localtest.me:4222

nsc add account desktop 
nsc edit account desktop --sk generate 
nsc add user --account desktop --name reader
nsc edit account --name desktop --js-mem-storage 128m --js-disk-storage 512m --js-streams 2 --js-consumer 3
nsc push -a desktop -u nats://auth2.localtest.me:4222

nsc add account webapp 
nsc edit account webapp --sk generate 
nsc add user --account webapp --name webapp-user
nsc edit account --name webapp --js-mem-storage 64m --js-disk-storage 128m --js-streams 1 --js-consumer 2
nsc push -a desktop -u nats://auth2.localtest.me:4222

```
- List keys
```
# All
nsc list keys -A
# All Accounts
nsc list keys -a
# All Users
nsc list keys -x

tree ~\.local\share\nats\nsc
```

### Generate resolver config to initialize nats.io server
```
nsc generate config --nats-resolver --sys-account SYS > src/pkgs/@amitkshirsagar13/nats-server/resolver.conf
nsc generate config --nats-resolver --sys-account SYS > resolver.conf
```

### Spin up the nats-server
```
openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout secrets/key.pem -out secrets/cert.pem -addext "subjectAltName = DNS:nats.localtest.me"
nats-server -c resolver.conf -ms 4443 --tls --tlscert=./secrets/cert.pem --tlskey=./secrets/key.pem
nats-server -c resolver.conf -m 4443
nsc push -A
```

### Setup nats cli to use different accounts and users
- Save different account/user context for use
```
nats context save devops-sys --nsc "nsc://devops/SYS/sys" --server=nats.localtest.me
nats context save worker-service --nsc "nsc://devops/worker/worker-service" --server=nats.localtest.me
nats context save reader --nsc "nsc://devops/desktop/reader" --server=nats.localtest.me

nats context ls

nats context rm context-name

```

### Export credentials for services to use
```
mkdir -p src/pkgs/@amitkshirsagar13/nats-client/creds
nsc generate creds -a desktop -n reader > src/pkgs/@amitkshirsagar13/nats-client/creds/reader.creds

mkdir -p src/pkgs/@amitkshirsagar13/nats-service/creds
nsc generate creds -a worker -n worker-service > src/pkgs/@amitkshirsagar13/nats-service/creds/worker-service.creds
```

### Check status
```
nats context select devops-sys

# Test Connection ping response
nats server ping --id --graph --user system

# List servers
nats server list

# List connections
nats server report connections

# Get account level message count
nats server report accounts devops --sort in-msgs --top 10

# List Micro Services
nats micro ls
```