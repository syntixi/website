---
sidebar_label: 'Config'
sidebar_position: 2
---

# Config

Config is a set of configurations used by application.

## How to create a config

### Literal

You can use `--from-literal <key>=<value>` to set configuration with literal string. The command is

```sh
$ syntixi config create --name db-config \
    --from-literal MYSQL_ADDRESS='127.0.0.1:3306' \
    --from-literal MYSQL_USER="root" \
    --from-literal MYSQL_PASSWD="password" 
```

which results in 

```yaml
apiVersion: core.syntixi.dev/v1
kind: Config
metadata:
  name: db-config
  namespace: default
spec:
  data:
    MYSQL_ADDRESS: MTI3LjAuMC4xOjMzMDY=
    MYSQL_PASSWD: cGFzc3dvcmQ=
    MYSQL_USER: cm9vdA==
```


### File

You can use `--from-file <key>=<absolute-path-to-file>` to set a configuration with file.

For demonstration, let's first use openssl to generate TLS files for domain `example.com`.

```sh
$ sudo openssl req -x509 -newkey rsa:4096 -sha256 -days 3650 -nodes \
    -keyout example.key -out example.crt -subj "/CN=example.com"
```

```sh
$ syntixi config create --name tls-cfg --type tls \
    --from-file tls.key=example.key \
    --from-file tls.crt=example.crt
```

which results in 

```yaml
apiVersion: core.syntixi.dev/v1
kind: Config
metadata:
  name: tls-cfg
  namespace: default
spec:
  data:
    tls.crt: <BASE64 CONTENT>
    tls.key: <BASE64 CONTENT>
  type: tls
```

## How to use a config in function

You can use config for a function in two ways:
* environment variables
* file
### Environment variable

Use config as environment variables with `--env-from-config CONFIG_NAME=KEY=ENV_NAME` when create pod.

Following example we use config previous created as environment variables.

```sh
$ syntixi function create --name=config-demo --image=nginx \
--env-from-config db-config=MYSQL_ADDRESS=MYSQL_ASSRESS \ 
--env-from-config db-config=MYSQL_USER=MYSQL_USER \
--env-from-config db-config=MYSQL_PASSWD=MYSQL_PASSWD
```
### File


Here is an example of using config as file and mounting it at `/opt/` with `--file-from-config CONFIG_NAME=KEY=/absolute/path/to/file`.

```sh
$ syntixi function create --name=config-demo --image=nginx \
--file-from-config db-config=MYSQL_ADDRESS=/opt/MYSQL_ASSRESS \ 
--file-from-config db-config=MYSQL_USER=/opt/MYSQL_USER \
--file-from-config db-config=MYSQL_PASSWD=/opt/MYSQL_PASSWD
```