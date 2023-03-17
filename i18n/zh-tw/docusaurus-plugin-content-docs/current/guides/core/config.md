---
sidebar_label: 'Config'
sidebar_position: 2
---

# Config

Config 是應用程式使用的一組設定

## 如何建立 Config

### 純文字

您可以使用 `--from-literal <key>=<value>` 來使用純文字建立設定檔，指令如下

```sh
$ syntixi config create --name db-config \
    --from-literal MYSQL_ADDRESS='127.0.0.1:3306' \
    --from-literal MYSQL_USER="root" \
    --from-literal MYSQL_PASSWD="password" 
```

建立的結果如下

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

您也可以使用 `--from-file <key>=<absolute-path-to-file>` 來使用檔案建立 Config

為了示範，我們先用 OpenSSL 來為域名 `example.com` 生成 TLS 憑證檔案。
```sh
$ sudo openssl req -x509 -newkey rsa:4096 -sha256 -days 3650 -nodes \
    -keyout example.key -out example.crt -subj "/CN=example.com"
```

```sh
$ syntixi config create --name tls-cfg --type tls \
    --from-file tls.key=example.key \
    --from-file tls.crt=example.crt
```

結果如下

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