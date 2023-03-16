---
sidebar_label: 'Installation'
sidebar_position: 1
---

# Installation

## Requirements

* [Kubernetes](>= 1.20, https://kubernetes.io/):  A workable Kubernetes cluster is required for running Syntixi. Following are some popular solutions to set up Kubernetes cluster with minimum effort.
    * Docker Desktop: https://www.docker.com/products/docker-desktop
    * Minikube: https://minikube.sigs.k8s.io/docs/start/
* [Kubectl](>= 1.20, https://kubernetes.io/docs/tasks/tools/): The version of Kubectl(Kubernetes CLI) should match Kubernetes version you test against with.
* [Helm](>= 3.0, https://helm.sh/) 

## Add Syntixi Helm repository

1. Add chart repository: `helm repo add syntixi https://releases.syntixi.dev/`
2. Update repository: `helm repo update syntixi`
3. Search repo for releases: `helm search repo syntixi`
  * For development releases: `helm search repo syntixi --devel -l`

## Install Syntixi

:::note

This tutorial doens't cover detail settings and therefore is only suitable for evaluation purpose.
If you're trying to set up for production environment, head over to **[Configuration](configuration.md)** before you continue.

:::

Let's install Syntixi to namespace `syntixi`.

```bash
# Install the latest version
$ helm install syntixi --namespace syntixi --create-namespace syntixi/syntixi

# Install the specific version
$ helm install syntixi --namespace syntixi --create-namespace --version <chart_version> syntixi/syntixi 
```

If your Kubernetes environment doesn't [persistence volume](https://kubernetes.io/docs/concepts/storage/persistent-volumes/)
yet, please set `storage.persistence.enabled` to `false`


```bash
$ helm install syntixi --namespace syntixi --create-namespace \
    --set storage.persistence.enabled=false syntixi/syntixi
```

## Install Syntixi CLI

Visit [release page](https://github.com/syntixi/releases/releases) to download CLI based on installed Syntixi version and your OS.

<details>
  <summary>MacOS</summary>

```bash
$ curl -fL -o syntixi https://github.com/syntixi/releases/releases/download/$(curl https://raw.githubusercontent.com/syntixi/releases/master/stable.txt)/syntixi-cli-osx
$ chmod +x syntixi
$ mv syntixi /usr/local/bin/syntixi
```
</details>

<details>
  <summary>Linux</summary>

* AMD64
```bash
$ curl -fL -o syntixi https://github.com/syntixi/releases/releases/download/$(curl https://raw.githubusercontent.com/syntixi/releases/master/stable.txt)/syntixi-cli-linux
$ chmod +x syntixi
$ mv syntixi /usr/local/bin/syntixi
```
</details>

<details>
  <summary>Others</summary>

Visit [release page](https://github.com/syntixi/releases/releases) to download CLI.
</details>

## Let Syntixi manage default namespace

```bash
# add label to default namespace
kubectl label namespace default app.kubernetes.io/managed-by=syntixi
```

## Hello World!

```bash
# A javascript that prints "Hello World"
$ curl https://raw.githubusercontent.com/syntixi/examples/master/environments/nodejs/hello.js > hello.js

# Upload your function code
$ syntixi bundle create --name hello-bundle --code hello.js

# Create the function with the bundle just created
$ syntixi function create --name hello \
    --image node:16-alpine3.11 \
    --bundle hello-bundle \
    --entry "node hello.js" 

# Your function is about to start running within a pod.
$ kubectl get pod -l functionName=hello

# Run the function.  This takes about 100msec the first time.
$ syntixi function test --name hello
Hello World
```