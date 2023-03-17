---
sidebar_label: 'Function'
sidebar_position: 1
---

# Function
Function 是一個應用程式容器，其執行指定的binary檔案或原始碼

目前Syntixi僅支援http服務運行在80 port。我們將會支援：
* 不同的 protocol，如 TCP,UDP
* 從其他 port 連接到應用程式

## 如何建立 function

Syntixi 讓使用者可以用 [容器映像檔](https://www.docker.com/resources/what-container) 
來建立 function，並且不需要做任何的異動。可以幫助使用者簡單地把他們的服務移植到 Kubernetes 中。如果您比較喜歡傳統的 
FaaS 方式，我們也支援使用原始碼建立 function

### 容器映象檔

這裡我們使用 [NGINX](https://hub.docker.com/_/nginx) 容器映像檔來當例子建立 function

```sh
$ syntixi function create --name fn-demo --image nginx
```

Kubernetes 下載容器映像檔時會花一些時間，當完成時您可以使用`function test`來測試您建立的 function

```sh
$ syntixi function test --name fn-demo
```
如果容器映像未指定入口點（entrypoint），例如 [此處](https://github.com/nginxinc/docker-nginx/blob/f958fbacada447737319e979db45a1da49123142/mainline/debian/Dockerfile#L116)，您將需要在建立 function 時 `--entry`。

```sh
$ syntixi function create --name fn-demo --image nginx --entry "nginx -g daemon off;"
```

### Bundle (使用原始碼或執行檔)

:::note

您需要一個 bundle 來進行以下步驟，可以參考 [Bundle](bundle.md#single-file) 来了解建立 bundle 的方法

:::

假設您已經使用 Node.js 原始碼來建立 bundle，接下來我們使用官方提供的[Node.js](https://hub.docker.com/_/node) 容器映像檔來建立 function。

```sh
$ syntixi function create --name hello \
    --image node:15.14.0-alpine3.10 \
    --bundle hello \ 
    --entry "node hello.js"
```

在 function 初始化階段時，會去下載 bundle 
並將內容放到容器的`/userfunc`底下，同時容器預設的工作目錄也是`/userfunc`，因此您可以將 function 
的 entry 參數設定為
```bash
node hello.js
```

或使用絕對路徑

```bash
node /userfunc/hello.js
```

## 要使用容器映像檔還是 bundle?

以下是一些建議，可以幫助您決定哪種更適合您的情況。

* 可攜性

從可攜性的角度來看，容器映像檔比起 bundle 具有更好的可攜性。考量要如何解決可攜性問題是非常重要的，例如，Syntixi 
安裝在客戶端，使用容器映像檔建立 function 會是更好的選擇，因為容器映像檔包含了所有必要的執行環境和相關套件。

* 編譯語言或直譯語言

編譯式語言通常需要開發者在建立時指定目標平台，例如作業系統和[指令集](https://en.wikipedia.org/wiki/Instruction_set_architecture)
，在這種情況容器映像檔是一個解決上述問題的好方法。

另一方面，直譯式語言只要容器映像檔包含所有必要的執行環境和相關套件，就可以在不同類型的機器上運行。

* Function 依賴的東西不是應用程式的一部分 (混合式)

假設您正在建立一個 RESTful API 服務，其中一個API需要使用機器學習模型進行推論。
由於機器學習模型不是 HTTP 服務代碼的一部分且經常更改，因此將 HTTP 服務和機器學習模型分開是很自然的。


在這種情況下，您可以使用帶有HTTP服務的容器映像檔，並參考包含機器學習模型的 bundle 來建立 function。一旦 bundle 中的機器學習模型更新，Syntixi將自動滾動更新相關的 function。

