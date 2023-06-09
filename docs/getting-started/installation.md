---
sidebar_label: 'Installation'
sidebar_position: 1
---

# Installation

## Requirements

* [Kubernetes (>= 1.20)](https://kubernetes.io/):  A workable Kubernetes cluster is required for running Syntixi. Following are some popular solutions to set up Kubernetes cluster with minimum effort.
    * Docker Desktop: https://www.docker.com/products/docker-desktop
    * Minikube: https://minikube.sigs.k8s.io/docs/start/
* [Kubectl (>= 1.20)](https://kubernetes.io/docs/tasks/tools/): The version of Kubectl(Kubernetes CLI) should match Kubernetes version you test against with.
* [Helm (>= 3.0)](https://helm.sh/) 

## Optional
* [kube-prometheus](https://github.com/prometheus-operator/kube-prometheus): A monitoring tool for Kubernetes cluster.

## Add Syntixi Helm repository

1. Add chart repository: `helm repo add syntixi https://releases.syntixi.dev/`
2. Update repository: `helm repo update syntixi`
3. Search repo for releases: `helm search repo syntixi`
  * For development releases: `helm search repo syntixi --devel -l`

## Install Syntixi

:::info

This tutorial doesn't cover detail settings and therefore is only suitable for evaluation purpose.
If you're trying to set up for production environment, head over to **[Configuration](configuration.md)** before you continue.

:::

Let's install Syntixi to namespace `syntixi`.

```bash
# Install the latest version
$ helm install syntixi --namespace syntixi --create-namespace syntixi/syntixi

# Install the specific version
$ helm install syntixi --namespace syntixi --create-namespace --version <chart_version> syntixi/syntixi 
```

If your Kubernetes environment doesn't support [persistence volume](https://kubernetes.io/docs/concepts/storage/persistent-volumes/)
yet, please set `storage.persistence.enabled` to `false`


```bash
$ helm install syntixi --namespace syntixi --create-namespace \
    --set storage.persistence.enabled=false syntixi/syntixi
```

## Install Syntixi CLI

Visit [release page](https://github.com/syntixi/releases/releases) to download CLI based on installed Syntixi version and your OS.

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details>
<summary>MacOS</summary>

<Tabs defaultValue="amd64" values={[
{ label: 'Intel', value: 'amd64', },
{ label: 'Apple Silicon', value: 'arm64', },
]}>
  
<TabItem value="amd64">

* syntixi-cli-darwin-amd64

```bash
curl -fL -o syntixi https://github.com/syntixi/releases/releases/download/$(curl https://raw.githubusercontent.com/syntixi/releases/master/stable.txt)/syntixi-cli-darwin-amd64
```

</TabItem>
<TabItem value="arm64">

* syntixi-cli-darwin-arm64

```bash
curl -fL -o syntixi https://github.com/syntixi/releases/releases/download/$(curl https://raw.githubusercontent.com/syntixi/releases/master/stable.txt)/syntixi-cli-darwin-arm64
```
  
</TabItem>
</Tabs>

</details>

<details>
<summary>Linux</summary>

<Tabs defaultValue="amd64" values={[
{ label: 'x86_64', value: 'amd64', },
{ label: 'arm64', value: 'arm64', },
]}>

<TabItem value="amd64">

* syntixi-cli-linux-amd64

```bash
curl -fL -o syntixi https://github.com/syntixi/releases/releases/download/$(curl https://raw.githubusercontent.com/syntixi/releases/master/stable.txt)/syntixi-cli-linux-amd64
```

</TabItem>
<TabItem value="arm64">

* syntixi-cli-linux-arm64

```bash
curl -fL -o syntixi https://github.com/syntixi/releases/releases/download/$(curl https://raw.githubusercontent.com/syntixi/releases/master/stable.txt)/syntixi-cli-linux-arm64
```

</TabItem>
</Tabs>

</details>

<details>
<summary>Windows</summary>

You can use [WSL](https://learn.microsoft.com/en-us/windows/wsl/) and download linux binary or visit [release page](https://github.com/syntixi/releases/releases) for windows x86_64/arm64 binary.
</details>

### Move CLI to executable directories

```bash
chmod +x syntixi
mv syntixi /usr/local/bin/syntixi
```

## Create "Hello World" function

Let's create your first HTTP function.

```bash
# A javascript that prints "Hello World"
$ curl https://raw.githubusercontent.com/syntixi/examples/master/environments/nodejs/hello.js > hello.js

# Upload your function code
$ syntixi bundle create --name hello-bundle --code hello.js

# Create the function with the bundle just created
$ syntixi function create --name hello \
    --image node:16-alpine3.11 \
    --bundle hello-bundle \
    --entry "node hello.js" \
    --port=tcp=80=http

# Your function is about to start running within a pod.
$ kubectl get pod -l functionName=hello

# Run the function.  This takes about 100msec the first time.
$ syntixi function test --name hello
Hello World
```