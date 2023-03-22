---
title: Cron Trigger
sidebar_label: 'Cron'
sidebar_position: 3
---

Cron Trigger 根據指定的週期來調用 Function

## 如何建立 Cron Trigger

假設想要每分鐘都執行某個 Function，您可以使用`* * * * *` Crontab 規範來建立 Cron Trigger。您可以到[這邊](https://en.wikipedia.org/wiki/Cron)瞭解更多有關於 Crontab 規範的設定方式。


```sh
$ syntixi crontrigger create --name hello --function hello --cron "* * * * *"
```

### 暫停 Cron Trigger

要暫停一個 Cron Trigger 需要在建立或更新 Cron Trigger時加入`--suspend`參數。現在我們暫停剛剛建立的 Cron Trigger

```sh
$ syntixi crontrigger update --name hello --suspend
```

要解除暫停 Cron Trigger，需要將 `--suspend` 設定為 `false`

```sh
$ syntixi crontrigger update --name hello --suspend=false
```