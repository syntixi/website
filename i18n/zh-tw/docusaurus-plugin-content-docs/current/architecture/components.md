---
sidebar_label: 'Components'
sidebar_position: 99
---

# Components

## Controllers

Controller 透過與 Kubernetes API Server 溝通來監控 Syntixi CRD 的異動。
當新的 CRD 被建立時 (除 Function 以外)，Controller 會創建與其相關聯的 Kubernetes 物件，
以供 Function Pod 後續使用。

![controller](/img/architecture/controller-api-server-crd.jpg)

另外，Controller 提供上傳 API，供客戶端建立 Bundle 時上傳程式碼壓縮檔至儲存空間。

## Scheduler

當 Function 建立時，Scheduler 負責建立與其相關聯的 Kubernetes 物件，如 Deployment、Service、HPA 等等。
若 Function 引用的資源如 Bundle 或 Config 發生異動時，Scheduler 將會觸發 Function Pod 的滾動升級以反應更新。

針對多雲/混合雲場景，Scheduler 會根據設定條件與資源使用狀況將 Function Pod 部署至適合的叢集。
當不同叢集出現負載不均或異常時，Scheduler 會自動觸發重新調度將 Pod 調度至其他叢集來以平衡叢集間負載狀況及提高服務可用性。

## Logger

Logger 負責收集各節點的 Function Pod 日誌並送至 InfluxDB 進行持久性儲存。使用者可以透過 CLI 指令取得指定 Function 的執行日誌，以提高除錯效率。

# Function Pod

當 Function 建立時，Scheduler 會根據其內容創建對應的 Pod，該 Pod 主要由兩個容器所組成: 

* Runtime: 執行使用者應用程式的容器
* Fetcher: 作為初始化容器 (init container)，Fetcher 會下載 Function 所引用的 Bundle 壓縮檔供 Runtime 啟動時執行使用。

## Storage

目前 Syntixi 只支援 MinIO 作為儲存後端來儲存 Bundle 的壓縮檔。

## Message Watcher

Syntixi 透過 Message watcher 來支援事件觸發 (Event Trigger) 的使用場景。當指定的 Topic 收到訊息時，Watcher 會透過 HTTP 調用對應的 Function Pod。
現階段，一個 Watcher Pod 只支援一種類別的消息佇列服務 (Message Queue Service)。若要支援其他種類消息佇列服務，則必須事先部署相關的 Watcher 才能正常調用 Function。


