---
sidebar_label: 'Installation'
sidebar_position: 1
---

# 安裝Syntixi

## 安裝需求

* [Kubernetes (>= 1.20)](https://kubernetes.io/):  Syntixi 需要運行在 Kubernetes 叢集之中，以下是熱門且容易建立 Kubernetes 的解決
    * Docker Desktop: https://www.docker.com/products/docker-desktop
    * Minikube: https://minikube.sigs.k8s.io/docs/start/
* [Kubectl (>= 1.20)](https://kubernetes.io/docs/tasks/tools/): Kubectl（Kubernetes CLI）的版本應與您進行測試的 Kubernetes 版本相匹配
* [Helm (>= 3.0)](https://helm.sh/) 

## 可選安裝項目
* [kube-prometheus](https://github.com/prometheus-operator/kube-prometheus): 一個用於監控 Kubernetes 叢集的工具，Syntixi Function 監控以該工具為基礎


## 新增 Syntixi Helm 儲存庫

1. 新增 Helm chart 儲存庫: `helm repo add syntixi https://releases.syntixi.dev/`
2. 更新儲存庫: `helm repo update syntixi`
3. 在儲存庫中搜尋釋出的版本: `helm search repo syntixi`
  * 搜尋開發版本: `helm search repo syntixi --devel -l`

## Install Syntixi

:::note

這篇教學只適用於評估目的，並不包含完整的詳細設定。如果您想要應用在正式環境中，可以先到 **[Configuration](configuration.md)** 查看相關訊息

:::

在 `syntixi` namespace 底下安裝 Syntixi

```bash
# 安裝最新版本
$ helm install syntixi --namespace syntixi --create-namespace syntixi/syntixi

# 安裝特定版本
$ helm install syntixi --namespace syntixi --create-namespace --version <chart_version> syntixi/syntixi 
```

如果你的 Kubernetes 叢集不支援 [persistence volume](https://kubernetes.io/docs/concepts/storage/persistent-volumes/)
請將 `storage.persistence.enabled` 設定成 `false`

```bash
$ helm install syntixi --namespace syntixi --create-namespace \
    --set storage.persistence.enabled=false syntixi/syntixi
```

## 安裝 Syntixi CLI

到 [發佈頁面](https://github.com/syntixi/releases/releases) 根據您要安裝的版本以及作業系統下載 CLI
<details>
  <summary>MacOS</summary>

```bash
$ curl -fLO -o syntixi https://github.com/syntixi/releases/releases/download/$(curl https://raw.githubusercontent.com/syntixi/releases/master/stable.txt)/syntixi-cli-osx
$ chmod +x syntixi
$ mv syntixi /usr/local/bin/syntixi
```
</details>

<details>
  <summary>Linux</summary>

* AMD64
```bash
$ curl -fLO -o syntixi https://github.com/syntixi/releases/releases/download/$(curl https://raw.githubusercontent.com/syntixi/releases/master/stable.txt)/syntixi-cli-linux
$ chmod +x syntixi
$ mv syntixi /usr/local/bin/syntixi
```
</details>

<details>
  <summary>Others</summary>

到 [發佈頁面](https://github.com/syntixi/releases/releases) 下載CLI
</details>

## 讓 Syntixi 管理 default namespace

```bash
# add label to default namespace
kubectl label namespace default app.kubernetes.io/managed-by=syntixi
```

## Hello World!

```bash
# A javascript that prints "Hello World"
$ curl https://raw.githubusercontent.com/syntixi/examples/master/environments/nodejs/hello.js > hello.js

# Upload your function code
$ syntixi bundle create --name hello-bundle --code hello.js

# Create the function with the bundle just created
$ syntixi function create --name hello \
    --image node:16-alpine3.11 \
    --bundle hello-bundle \
    --entry "node hello.js" \
    --port=tcp=80=http
    

# Your function is about to start running within a pod.
$ kubectl get pod -l functionName=hello

# Run the function.  This takes about 100msec the first time.
$ syntixi function test --name hello
Hello World
```