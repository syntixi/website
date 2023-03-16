---
sidebar_label: 'Namespace'
sidebar_position: 0
---

# Namespace

## Managed Namespace

Syntixi 只管理帶有 `app.kubernetes.io/managed-by=syntixi` 標籤的命名空間。
若要將命名空間納入管理，您需要使用下面指令為命名空間添加標籤:

```sh
$ kubectl label namespace <namespace> app.kubernetes.io/managed-by=syntixi
```

在為 `default` 命名空間（或任何其他命名空間）添加標籤後，你應該看到:

```sh
$ kubectl get namespace --show-labels
NAME      STATUS   AGE     LABELS
default   Active   174d    app.kubernetes.io/managed-by=syntixi
```

## Create Namespaced CRDs

Syntixi CLI 預設使用 `$HOME/.kube/config` 的 `current-context` 命名空間對 Kubernetes API Server 發起操作請求

```sh
# View current context
$ kubectl config view --minify

# Set namespace for CLI operations
$ kubectl config set-context --current --namespace=<namespace>

# View current namespace
$ kubectl config view --minify --output 'jsonpath={..namespace}'
```

假設當前命名空間為 `default`，則下面指令將會在該命名空間建立 Bundle 物件:

```sh
$ syntixi bundle create --name hello --code hello.js
```

你也可以在執行 CLI 操作時加上 `--namespace (-n)` 來更改當次操作的命名空間

```sh
$ syntixi --namespace <namespace> bundle create --name hello --code hello.js
```

## No Cross Namespace Reference

命名空間內的物件不能被位於不同命名空間內的物件所引用。

假設在命名空間 `foobar` 中創建了一個 Function，並嘗試引用命名空間 `default` 中的一個 Bundle 時，
因為兩個資源不在同一個命名空間中，系統無法在命名空間 `foobar` 中找到名為 `hello` 的 Bundle，
因此 CLI 會顯示 `resource not found` 錯誤。

```sh
$ syntixi -n foobar function create --name hello --bundle hello --image nginx
Error: Bundle needs to be present in the same namespace 'foobar' as function 'hello': 
bundles.core.syntixi.dev "hello" not found
```

禁用跨命名空間引用不僅可以在開發 Syntixi 時減少複雜性還帶來許多好處，例如支持多租戶場景 (multi-tenant)，
以及提供強大的命名空間隔離以避免任何潛在的安全問題。