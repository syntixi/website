---
sidebar_label: 'Function'
sidebar_position: 1
---

# Function
Function 是一個應用程式容器，其執行指定的 binary 檔案或原始碼。

## 如何建立 Function

Syntixi 讓使用者可以用 [容器映像檔](https://www.docker.com/resources/what-container) 
來建立 Function，並且不需要做任何的異動，可以幫助使用者簡單地把他們的服務移植到 Kubernetes 中。如果您比較喜歡傳統的 
FaaS 方式，我們也支援使用原始碼建立 Function。

### 容器映象檔

這裡我們使用 [NGINX](https://hub.docker.com/_/nginx) 容器映像檔來當例子建立 Function，並透過 `--port` 來指定揭露的 port

```sh
$ syntixi function create --name fn-demo --image nginx --port=tcp=80=http
```

Kubernetes 下載容器映像檔時會花一些時間，當完成時您可以使用 `test` 來測試您建立的 Function

```sh
$ syntixi function test --name fn-demo
```
如果像[此處](https://github.com/nginxinc/docker-nginx/blob/f958fbacada447737319e979db45a1da49123142/mainline/debian/Dockerfile#L116)容器映像檔未指定入口點（entrypoint），您需要在建立 Function 時加上 `--entry` 參數。

```sh
$ syntixi function create --name fn-demo --image nginx --entry "nginx -g daemon off;"
```

### Bundle (使用原始碼或執行檔)

:::note

您需要一個 Bundle 來進行以下步驟，可以參考 [Bundle](bundle.md#single-file) 来了解如何建立 Bundle 

:::

假設您已經使用 Node.js 原始碼來建立 Bundle，接下來我們使用官方提供的 [Node.js](https://hub.docker.com/_/node) 容器映像檔來建立 Function。

```sh
$ syntixi function create --name hello \
    --image node:15.14.0-alpine3.10 \
    --bundle hello \ 
    --entry "node hello.js"
```

在 Function 初始化階段時，Fetcher 會去下載 Bundle 
並將內容放到容器的 `/userfunc` 底下，同時容器預設的工作目錄也是 `/userfunc`，因此您可以將 Function 
的 entry 參數設定為

```bash
node hello.js
```

或使用絕對路徑

```bash
node /userfunc/hello.js
```

### 揭露 Function port
你可以在建立 Function 透過 `--port` 參數來指定要揭露的 Function port

以下是 `--port` 參數的使用方式
```bash
--port=<protocol>=<port_number>=<port_name>
--port=tcp=80=http --port=tcp=443=https --port=udp=53=dns
```



## 要使用容器映像檔還是 Bundle?

以下是一些建議，可以幫助您決定哪種更適合您的情況。

* 可攜性

從可攜性的角度來看，容器映像檔比起 Bundle 具有更好的可攜性。考量要如何解決可攜性問題是非常重要的，例如，Syntixi 
安裝在客戶端時，使用容器映像檔建立 Function 會是更好的選擇，因為容器映像檔包含了所有必要的執行環境和相關套件。

* 編譯語言或直譯語言

編譯式語言通常需要開發者在建立時指定目標平台，例如作業系統和[指令集](https://en.wikipedia.org/wiki/Instruction_set_architecture)
，在這種情況容器映像檔是一個解決此問題的好方法。另一方面，直譯式語言只要容器映像檔包含所有必要的執行環境和相關套件，就可以在不同類型的機器上運行。

* Function 依賴的東西不是應用程式的一部分 (混合式)

假設您正在建立一個 RESTful API 服務，其中一個 API 需要使用機器學習模型進行推論。
由於機器學習模型不是 HTTP 服務程式的一部分且經常更改，因此將 HTTP 服務和機器學習模型分開管理是很正常的。


在這種情況下，您可以使用帶有 HTTP 服務的容器映像檔，並參考包含機器學習模型的 Bundle 來建立 Function。一旦 Bundle 中的機器學習模型更新，Syntixi 將自動滾動更新相關的 Function。


## Function 監控

如果你想使用 Syntixi function 監控機制的話，需要事先安裝 [kube-prometheus](https://github.com/prometheus-operator/kube-prometheus)。
Syntixi 透過 [Grafana](https://grafana.com/) 和 [Prometheus](https://prometheus.io/) 提供基礎的 function 監控，
當你建立 Function 時，Syntixi 會透過 [grafana-operator](https://github.com/grafana-operator/grafana-operator)自動生成 Grafana dashboard，

我們目前提供的 Function 監控項目如下：

```
* Available pod percent
* CPU usage
* CPU throttling
* memory usage
```

### 客製化 Panel

如果上述監控項目無法滿足您的需求，您可以透過 `--panel` 參數來增加客製化的 [Grafana panel](https://grafana.com/docs/grafana/latest/panels-visualizations/)。

客製化 Panel 的 json 可以使用以下變數，將自動替換成 Function 的相關資料：
```
{{.FunctionNamespace}}
{{.FunctionName}}
```

這邊是一個新增客製化 Panel 的範例：
```sh
# --panel syntax: --panel=<name>=<panel-json>
$ syntixi fn create --image=nginx --name=nginx --panel=my_panel='{"datasource":"$datasource","description":"","fieldConfig":{"defaults":{"mappings":[],"thresholds":{"mode":"percentage","steps":[{"color":"dark-red","value":null},{"color":"orange","value":50},{"color":"green","value":100}]},"color":{"mode":"thresholds"},"max":1,"min":0,"unit":"percentunit"},"overrides":[]},"gridPos":{"h":8,"w":4,"x":6,"y":1},"id":30,"options":{"reduceOptions":{"values":false,"calcs":["lastNotNull"],"fields":""},"orientation":"auto","showThresholdLabels":false,"showThresholdMarkers":true},"pluginVersion":"9.5.1","targets":[{"datasource":"$datasource","editorMode":"builder","exemplar":false,"expr":"kube_deployment_status_replicas_available{namespace=\"default\",deployment=\"nginx\"}/kube_deployment_spec_replicas{namespace=\"{{.FunctionNamespace}}\",deployment=\"{{.FunctionName}}\","format":"time_series","instant":false,"legendFormat":"__auto","range":true,"refId":"A"}],"title":"DEMO","type":"gauge"}'
```
在 Function 建立完成之後，Syntixi 會將新增的 panel 放在原本的 panel 下方。
