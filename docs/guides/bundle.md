---
sidebar_label: 'Bundle'
sidebar_position: 0
---

# Bundle

import Highlight from '@site/src/components/Highlight';

<div class="pill-list">
    <Highlight color="rgb(31 167 138)">Community</Highlight>
    <Highlight color="rgb(238 67 110)">Enterprise</Highlight>
</div>

## Introduction

Bundle is an archive that contains source codes, ML models or any files for running a function.

At function initial stage, Syntixi downloads and extracts archive contents 
to volume and a function can access these files under `/userfunc`. Currently, 
CLI supports to create a bundle with local files or a publicly accessible URL.  

## How to create a bundle

### Single file

```bash
$ wget https://github.com/syntixi/examples/blob/master/environments/nodejs/hello.js
$ syntixi bundle create --name hello --code hello.js
```

### Multiple files

To create a multiple files bundle, you first need to put all necessary files in a directory and 
use `--code` when creating the bundle.

For example, the target directory's structure looks like

```bash
$ tree demo/                                                                                                                                                                                                                                                                                    15:21:35
demo/
├── foo
│   └── bar
│       └── log.js
└── entry.js
```

The CLI creates an archives contains the target directory specified with `--code` and upload it to server. 

```bash
# Equivalent to "zip -r <name>.zip <directory>"  
$ syntixi bundle create --name demo --code demo/
```

All files can be found under `/userfunc/<target directory name>`.

```bash
# relative path
node demo/entry.js

# absolute path
node /userfunc/demo/entry.js 
```

### ZIP

Let's create a zip file first and use `--archive` to create a bundle with existing zip file.

```bash
$ zip -r <name>.zip <directory>
$ syntixi bundle create --name hello --archive <name>.zip
```

The CLI calculates the SHA256 checksum of zip file before uploading to ensure file integrity, however,
it takes long time when processing large file, use `--checksum` to skip checksum calculation.   

```bash
$ syntixi bundle create --name hello --archive <name>.zip --checksum <sha256-checksum>
```

You can check zip file structure with the following command:

```bash
$ zip -sf <name>.zip
```

### Remote URL

There are two limitations when creating a bundle with remote URL:

1. The URL must be accessible inside the Kubernetes cluster.
2. The download file must be in the `zip` format.

```bash
$ syntixi bundle create --name hello --archive <url-to-zip-file> --checksum <sha256-checksum>

# Use "--insecure" to skip file integrity check before uploading and after downloading.
# It improves the function startup time, however, it also brings potential security 
# issue if you cannot control the content of URL points to.
$ syntixi bundle create --name hello --archive <url-to-zip-file> --insecure
```
