---
sidebar_label: 'Installation'
sidebar_position: 0
---

# Installation

## Requirements

* [Kubernetes](https://kubernetes.io/): A workable Kubernetes cluster is required for running Syntixi. Following are some popular solutions to set up Kubernetes cluster with minimum effort.
    * Docker Desktop: https://www.docker.com/products/docker-desktop
    * Minikube: https://minikube.sigs.k8s.io/docs/start/
* [Kubectl](https://kubernetes.io/docs/tasks/tools/): The version of Kubectl(Kubernetes CLI) should matches Kubernetes version you test against with.
* [Helm](https://helm.sh/) >= 3.0

## Add Helm Repository

Add Syntixi helm repository.

```bash
$ helm repo add syntixi-charts https://charts.syntixi.dev/
$ helm search repo syntixi-charts
```

## Install Syntixi

:::note

This tutorial doens't cover detail settings and therefore is only suitable for evaluation purpose.
If you're trying to setup for production environment, head over to **[Configuration](configuration.md)** before you continue.

:::

Let's install Syntixi to namespace `syntixi`.

```bash
$ kubectl create namespace syntixi
$ helm install --namespace syntixi --name-template syntixi syntixi-charts/syntixi:3.0
```

## Install CLI

```bash
$ curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
```

## Hello World!

```bash
# A javascript one-liner that prints "hello world"
$ curl https://raw.githubusercontent.com/syntixi/examples/master/environments/nodejs/hello.js > hello.js

# Upload your function code
$ syntixi bundle create --name hello-bundle --code hello.js

# Create the function with the bundle just created
$ syntixi function create --name hello --image node:16-alpine3.11 --bundle hello-bundle 

# Run the function.  This takes about 100msec the first time.
$ syntixi function test --name hello
Hello World
```