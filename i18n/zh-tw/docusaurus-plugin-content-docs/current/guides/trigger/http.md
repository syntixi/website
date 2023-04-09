---
title: HTTP Trigger
sidebar_label: 'HTTP'
sidebar_position: 1
---

HTTP Trigger 揭露內部的 Function 讓其可以被外部存取


## 如何建立 HTTP Trigger

:::caution

在正式環境中請勿建立沒有指定任何主機或是域名且使用路徑 `/`的 HTTP Trigger，這會導致通過 Ingress 控制器的請求都會送到指定的 Function



:::

### 路徑匹配

以下指令將您的 Function 揭露在路徑 `/` 並接受來自所有目的主機的請求。


```sh
# Demo only, do NOT do this in production cluster.
$ syntixi httptrigger create --name hello --function hello --path "/"
```

```
$ INGRESS_SERVICE_LOAD_BALANCER_IP=$(kubectl -n ingress-nginx get svc ingress-nginx-controller -o jsonpath='{...ip}')
$ curl http://${INGRESS_SERVICE_LOAD_BALANCER_IP}/
```

### 路徑類型

每個路徑都需要有對應的路徑類型來做匹配。


使用 `--path <path>=<path-type>` 來指定路徑種類，如果沒有指定該參數時，預設使用 `Exact` 來當做路徑類型。

```sh
$ syntixi httptrigger create --name hello --function hello --path "/foo/bar=Exact"
```

以下為三種支援的路徑類型：

* `Exact`: **(default)** 精確的匹配並且會區分大小寫

* `Prefix`: 根據 URL 路徑前綴(以 / 分隔)進行匹配，匹配會區分大小寫並且對路徑中的元素逐個比對完成。路徑元素指的是由 `/` 分隔出的路徑標籤列表。一個請求匹配路徑 P 的條件為：路徑 P 的路徑元素為請求路徑元素的前綴

* `ImplementationSpecific`: 這種路徑類型匹配方式取決於 Ingress 控制器，具體做法可以將其視為獨立的路徑類型，或是像 Prefix 或 Exact 的路徑型別相同對待。

Path Type     | Path(s)  | 	Request path(s) | Matches?
:-------------|---------:|-----------------:| :----
Exact         | /foo     |  /foo            | Yes
Exact         | /foo     |  /foo/           | No
Prefix        | /        |  (all paths)     | Yes
Prefix        | /foo     |  /foo, /foo/     | Yes
Prefix        | /foo/    |  /foo, /foo/     | Yes
Prefix        | /foo/    |  /foo            | Yes, ignores trailing slash
Prefix        | /foo/    |  /foo/           | Yes, matches trailing slash
Prefix	      | /aaa/bbb |  /aaa/bbb/ccc	| Yes, matches subpath
Prefix	      | /aaa/bbb |  /aaa/bbbxyz     | No, does not match string prefix
Mixed         | /foo (Prefix), /foo (Exact)	| /foo | Yes, prefers Exact

### Host

我們強烈建議使用 HTTP Trigger 揭露 Function 時要指定目的主機或是域名，這樣可以避免多個使用相同 URL 路徑的 Function 時發生衝突。


使用 `--host` 參數來指定 HTTP Trigger 目的主機或是域名


```sh
$ syntixi ht create --name hello --path "/" --function hello --host example.com
$ curl -H 'Host: example.com' http://${INGRESS_SERVICE_LOAD_BALANCER_IP}/
```

### TLS

:::note

在繼續之前，您需要一個 TLS Config，請到 [Config](../core/config.md#file) 來瞭解如何建立。

:::

使用 `--tls` 參數指定要使用的 TLS Config，這邊的範例假設您已使用 tls-cfg 為名建立 TLS config


```sh
$ syntixi ht create --name hello --path "/" --function hello --host example.com --tls tls-cfg
$ curl --insecure -H 'Host: example.com' http://${INGRESS_SERVICE_LOAD_BALANCER_IP}/
```

## 支援的 Ingress Controller

Syntixi 使用 Kubernetes [ingress](https://kubernetes.io/docs/concepts/services-networking/ingress/) 來實現終止 TLS 以及路徑匹配。將來我們將提供更多的 Ingress 控制器。

* [NGINX Ingress Controller](https://kubernetes.github.io/ingress-nginx/)