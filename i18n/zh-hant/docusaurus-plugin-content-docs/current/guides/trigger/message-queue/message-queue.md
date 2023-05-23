---
title: Message Queue Trigger
sidebar_label: 'Trigger'
sidebar_position: 1
---

Message Queue Trigger 當收到已訂閱主題的訊息的時候會調用 Function。

## 如何建立一個 Message Queue Trigger

在建立 Message Queue Trigger 時必須提供三個主題。


* **Topic** (required)
    * Syntixi 訂閱這個主題並且當收到訊息時會去調用 Function。
* **Response topic** (optional)
    * 如果執行成功且函數回傳的狀態碼為 200 時，會將回應送至這個主題。
* **Error topic** (optional)
    * 如果有在執行時有任何錯誤發生或是回傳狀態碼不是 200 時會將錯誤訊息送至此主題。
    * 建議要監控此主題是否有接到錯誤訊息，這樣可盡快處理錯誤。
    * 如果沒有指定錯誤主題，所有的錯誤訊息將會被拋棄，這樣會增加處理問題的複雜度。

```sh
$ syntixi mqt create --name hello --function hello \
    --topic hw --resptopic 'hw-response' --errtopic 'hw-error'
```

### 內容格式

Syntixi 送出的內文格式預設為 `application/json`，如果要使用別的格式的話可以在更新或建立 Message Queue Trigger 透過 `--contenttype` 指定內文格式。

例如，當 Function 只接受 Yaml 格式的請求，我們可以透過更新來將 Message Queue Trigger 的訊息格式改為 `text/yaml`。

```sh
$ syntixi mqt update --name hello --contenttype 'text/yaml'
```