---
sidebar_label: 'Function'
sidebar_position: 1
---

# Function

import Highlight from '@site/src/components/Highlight';

<div class="pill-list">
    <Highlight color="rgb(31 167 138)">Community</Highlight>
    <Highlight color="rgb(238 67 110)">Enterprise</Highlight>
</div>

## Introduction

Function is an application container that executes provided binary or source code.

## How to create a function

Syntixi allows users to create a function with [container image](https://www.docker.com/resources/what-container) without
modifying existing application. It helps users to migrate their service to Kubernetes easily. If you are in favor of
traditional FaaS way to create a function, we also support to create a function with source code.

### With container image

Here we use [NGINX](https://hub.docker.com/_/nginx) container image to create an example function and specify a container port with `--port` argument.

```sh
$ syntixi function create --name fn-demo --image nginx --port=tcp=80=http
```

It may take some time for Kubernetes to pull container imager. Once it's done, you can test your function with
subcommand `test`

```sh
$ syntixi function test --name fn-demo
```

If the container image doesn't specify the entrypoint like [here](https://github.com/nginxinc/docker-nginx/blob/f958fbacada447737319e979db45a1da49123142/mainline/debian/Dockerfile#L116).
You will need to pass `--entry` when creating the function.

```sh
$ syntixi function create --name fn-demo --image nginx --entry "nginx -g daemon off;"
```

### With bundle

:::note

You will need a bundle for the following steps. Visit [here](bundle.md#single-file) to learn how to create a bundle.

:::

Assume you have created a bundle with code written in Node.js. 
Let's use container image from official [Node.js](https://hub.docker.com/_/node) container registry.

```bash
$ syntixi function create --name hello \
    --image node:15.14.0-alpine3.10 \
    --bundle hello \ 
    --entry "node hello.js"
```

At function initial stage, system downloads and extracts bundle contents to volume that 
can be accessed from function container under path `/userfunc`. Default work directory 
of function container is `/userfunc`, you can set the function entry to

```bash
node hello.js
```

or in absolute path format

```bash
node /userfunc/hello.js
```

### Expose function ports
You can expose function ports with `--port` arguments when creating function.

The following example shows how to use `--port` arguments to expose multiple ports.
```bash
--port=<protocol>=<port_number>=<port_name>
--port=tcp=80=http --port=tcp=443=https --port=udp=53=dns
```


## Use container image or bundle ?

Here are some guidelines that can help you to decide which is better fit in your case.

* Portability of artifacts

From the aspect of portability, the container image has better portability compares to bundle.
Hence, an important thing to consider is **how hard to solve portability problem**.
For example, if Syntixi is installed at the client-side, then create with container image would be a better choice as 
the container image contains all necessary execution environment and dependencies.

* Compiled or interpreted language

Compiled language normally requires developers to specify the target platform like OS and [ISA](https://en.wikipedia.org/wiki/Instruction_set_architecture)
during build time. For such cases, container image is an ideal way to solve problems above.

Interpreted language, on the other hand, is able to run on different type of machine as long as 
the container image contains all necessary execution environment and dependencies.

* A function relies on things that are not part of application (Hybrid)

Assume you are creating a RESTful API service and one of the API requires a machine learning model to perform inference.
Since the ML model is not part of HTTP server source code and changes frequently, it's intuitive to seperated the HTTP service
and ML model. 

In this case, you can create a function with HTTP service image and referenced the bundle contains ML model. Once the
bundle is updated with the latest model, Syntixi will perform rolling update for function automatically.

## Function monitoring

Syntixi provides basic function monitoring through [Grafana](https://grafana.com/) and [Prometheus](https://prometheus.io/). When you create a function, Syntixi will automatically create a Grafana dashboard using [grafana-operator](https://github.com/grafana-operator/grafana-operator). To utilize Syntixi's monitoring mechanism, 
you will need to install kube-prometheus beforehand.

Syntixi offers basic function monitoring via [Grafana](https://grafana.com/) and [Prometheus](https://prometheus.io/). Upon creating a function, it automatically generates a Grafana dashboard using the grafana-operator. To fully leverage Syntixi's monitoring mechanisms, it is necessary to have kube-prometheus installed in advance.

Below are metrics available for basic function monitoring :

```
* Available pod percent
* CPU usage
* CPU throttling
* Memory usage
```

![Function Grafana Dashboard](/img/function/monitoring/function-grafana-panel.png)

### Customized panel

<div class="pill-list">
    <Highlight color="rgb(238 67 110)">Enterprise</Highlight>
</div>

If you are unsatisfied with above monitoring items, you can add customized [Grafana panel](https://grafana.com/docs/grafana/latest/panels-visualizations/) with `--panel` argument.

Following variables in the customized panel JSON will be automatically replaced with the relevant data of the function:

```
{{.FunctionNamespace}}
{{.FunctionName}}
```

Here is an example to create customized panel:

```sh
# --panel syntax: --panel=<name>=<panel-json>
$ syntixi fn create --image=nginx --name=nginx --panel=my_panel='{"datasource":"$datasource","description":"","fieldConfig":{"defaults":{"mappings":[],"thresholds":{"mode":"percentage","steps":[{"color":"dark-red","value":null},{"color":"orange","value":50},{"color":"green","value":100}]},"color":{"mode":"thresholds"},"max":1,"min":0,"unit":"percentunit"},"overrides":[]},"gridPos":{"h":8,"w":4,"x":6,"y":1},"id":30,"options":{"reduceOptions":{"values":false,"calcs":["lastNotNull"],"fields":""},"orientation":"auto","showThresholdLabels":false,"showThresholdMarkers":true},"pluginVersion":"9.5.1","targets":[{"datasource":"$datasource","editorMode":"builder","exemplar":false,"expr":"kube_deployment_status_replicas_available{namespace=\"default\",deployment=\"nginx\"}/kube_deployment_spec_replicas{namespace=\"default\",deployment=\"nginx\"}","format":"time_series","instant":false,"legendFormat":"__auto","range":true,"refId":"A"}],"title":"HAHA","type":"gauge"}'
```

After function creation, customized panel will be added to dashboard below the origin panels.