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


### 檔案

您也可以使用 `--from-file <key>=<absolute-path-to-file>` 來使用檔案建立 Config

為了示範，我們先用 OpenSSL 來為域名 `example.com` 生成 TLS 憑證檔案，然後使用生成的檔案建立 Config。
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

## 如何在 Function 使用 Config

您可以使用兩種方式來讓 Function 使用 Config 內的資料：
* 環境變數
* 檔案

### 環境變數

使用 Config 當作 Function Pod 的環境變數 `--env-from-config CONFIG_NAME=KEY=ENV_NAME`

以下為使用上面建立的 Config 來當作 Function pod 的環境變數
```sh
$ syntixi function create --name=config-demo --image=nginx \
--env-from-config db-config=MYSQL_ADDRESS=MYSQL_ASSRESS \ 
--env-from-config db-config=MYSQL_USER=MYSQL_USER \
--env-from-config db-config=MYSQL_PASSWD=MYSQL_PASSWD
```
### 檔案

這邊是一個使用`--file-from-config CONFIG_NAME=KEY=/absolute/path/to/file`來把 Config 當作檔案放入 Function pod 的 `/opt/` 底下的範例

```sh
$ syntixi function create --name=config-demo --image=nginx \
--file-from-config db-config=MYSQL_ADDRESS=/opt/MYSQL_ASSRESS \ 
--file-from-config db-config=MYSQL_USER=/opt/MYSQL_USER \
--file-from-config db-config=MYSQL_PASSWD=/opt/MYSQL_PASSWD
```