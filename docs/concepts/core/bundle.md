---
title: Bundle
sidebar_label: 'Bundle'
sidebar_position: 1
---

Bundle is an archive of files for function to execute with, it may contain source code files or machine learning models.

At function initial stage, [Fetcher](xxx) downloads and extracts archive contents 
to function pod volume which can be accessed with path `/userfunc`. Currently, 
CLI supports to create a bundle with local files or a publicly accessible URL.  

## How to create a bundle

### Single file

```bash
$ wget https://github.com/syntixi/examples/blob/master/environments/nodejs/hello.js
$ syntixi bundle create --name hello --code hello.js
```

### Multiple files

To create a multiple files bundle with CLI, you first need to put all necessary files in a directory and 
use `--codir` when creating the bundle.

For example, the target directory's structure looks like

```bash
$ tree demo/                                                                                                                                                                                                                                                                                    15:21:35
demo/
├── foo
│   └── bar
│       └── log.js
└── entry.js
```

The CLI creates an archives contains the target directory specified with `--codedir` and upload it to server. 

```bash
# --codedir is equivalent "zip -r <name>.zip <directory>"  
$ syntixi bundle create --name demo --codedir demo/
```

All files can be found under `/userfunc/<target directory name>`.

```bash
# relative path
node demo/entry.js

# absolute path
node /userfunc/demo/entry.js 
```

### ZIP

Let's create a zip file first and use `--deploy` to create a bundle with existing zip file.

```bash
$ zip -r <name>.zip <directory>
$ syntixi bundle create --name hello --deploy <name>.zip
```

The CLI calculates the SHA256 checksum of zip file before uploading to ensure file integrity, however,
it takes long time when processing large file, use `--deploychecksum` to skip checksum calculation.   

```bash
$ syntixi bundle create --name hello --deploy <name>.zip --deploychecksum <sha256-checksum>
```

The function entry will depend on the structure of zip file. You can check zip file structure with the following command:  

```bash
$ zip -sf <name>.zip
```

### Remote URL

There are two limitations when creating a bundle with remote URL:

1. The URL must be accessible inside the Kubernetes cluster.
2. The file that URL points to must be in the `zip` format.

```bash
$ syntixi bundle create --name hello --code <url-to-zip-file>
$ syntixi bundle create --name hello --deploy <url-to-zip-file> --deploychecksum <sha256-checksum>

# Use "--insecure" to skip file integrity check before uploading and after downloading.
# It improves the function startup time, however, it also brings potential security 
# issue if you cannot control the content of URL points to.
$ syntixi bundle create --name hello --deploy <url-to-zip-file> --insecure
```
