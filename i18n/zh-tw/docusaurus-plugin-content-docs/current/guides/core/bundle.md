---
sidebar_label: 'Bundle'
sidebar_position: 0
---

# Bundle

Bundle 是供 Function 執行運作時所使用的壓縮檔，
其中可能包含原始碼檔案或機器學習模型。

在 Function 的初始階段，Syntixi 會下載並解壓縮 Bundle 檔案至 Function pod 的 `/userfunc` 路徑底下。。 
目前 CLI 支援使用本地檔案或公開可訪的 URL 來創建 Bundle。
## 如何建立一個 Bundle

### 單一檔案

```bash
$ wget https://github.com/syntixi/examples/blob/master/environments/nodejs/hello.js
$ syntixi bundle create --name hello --code hello.js
```

### 多個檔案

建立一個多檔案的 Bundle 時，需要先把所有檔案放到一個資料夾底下，然後使用 `--code` 參數來建立 Bundle。

舉例來說，目標資料夾的結構如下:

```bash
$ tree demo/                                                                                                                                                                                                                                                                                    15:21:35
demo/
├── foo
│   └── bar
│       └── log.js
└── entry.js
```
用 CLI 指令並使用 `--code` 參數指定資料夾以建立 Bundle 並上傳至伺服器端

```bash
# Equivalent to "zip -r <name>.zip <directory>"  
$ syntixi bundle create --name demo --code demo/
```
當 Function 建立後，所有檔案都會放在 Function pod 的 `/userfunc/<target directory name>` 底下

```bash
# relative path
node demo/entry.js

# absolute path
node /userfunc/demo/entry.js 
```

### ZIP 壓縮檔

我們先建立 zip 壓縮檔並使用 `--archive` 參數來建立 Bundle
```bash
$ zip -r <name>.zip <directory>
$ syntixi bundle create --name hello --archive <name>.zip
```
在上傳之前 CLI 會計算 zip 檔案的 SHA256 校驗碼來確保檔案的完整性，
然而在這個階段會耗費較長的時間，可以使用 `--checksum` 指定校驗碼或是 `--insecure` 來避免計算校驗碼

```bash
$ syntixi bundle create --name hello --archive <name>.zip --checksum <sha256-checksum>
$ syntixi bundle create --name hello --archive <name>.zip --insecure
```

可以使用以下指令來確定 zip 檔案的結構

```bash
$ zip -sf <name>.zip
```

### Remote URL

使用 URL 來建立 Bundle 有以下兩個限制

1. Kubernetes 叢集內部必須可以連線到該 URL
2. 該URL下載的檔案必須是 .zip 格式

```bash
$ syntixi bundle create --name hello --archive <url-to-zip-file> --checksum <sha256-checksum>
# Use "--insecure" to skip file integrity check before uploading and after downloading.
# It improves the function startup time, however, it also brings potential security 
# issue if you cannot control the content of URL points to.
$ syntixi bundle create --name hello --archive <url-to-zip-file> --insecure
```
