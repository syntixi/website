---
title: Installation
sidebar_label: 'Installation'
sidebar_position: 1
---

## Requirements

* [Kubernetes](https://kubernetes.io/): A workable Kubernetes cluster is required before installing Syntixi. Following are some popular solutions to set up Kubernetes cluster with minimum effort.
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

## Create namespace

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
# Add the stock NodeJS env to your Syntixi deployment
$ syntixi env create --name nodejs --image syntixi/node-env

# A javascript one-liner that prints "hello world"
$ curl https://raw.githubusercontent.com/syntixi/examples/master/environments/nodejs/hello.js > hello.js

# Upload your function code to syntixi
$ syntixi bundle create --name hello-bundle --env nodejs --code hello.js

# Create the function with the package just created
$ syntixi function create --name hello --env nodejs --bundle hello-bundle 

# Map GET /hello to your new function
$ syntixi route create --method GET --url /hello --function hello

# Run the function.  This takes about 100msec the first time.
$ syntixi function test --name hello
Hello, world!
```