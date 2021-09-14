---
title: Function
sidebar_label: 'Function'
sidebar_position: 2
---

Function is an application container that executes provided binary or source code.

As of now, Syntixi only supports running HTTP service that exports at 80 ports. In the future, we plan to support:

* Different protocol like TCP and UDP.
* Application exposes in different ports.

## How to create a function

Syntixi allows users to create a function with [container image](https://www.docker.com/resources/what-container) without
modifying existing application. It helps users to migrate their service to Kubernetes easily. If you are in favor of
traditional FaaS way to create a function, we also support to create a function with source code.

### Container image

Here we use [NGINX](https://hub.docker.com/_/nginx) container image to create an example function.

```sh
$ syntixi function create --name fn-demo --image nginx
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

### Bundle (archive of source code or binary)

:::note

You will need a bundle for the following steps. Visit [here](bundle.md#single-file) to learn how to create a bundle.

:::

Assume you have created a bundle with code written in Node.js. 
Let's use container image from official [Node.js](https://hub.docker.com/_/node) container registry.

```sh
$ syntixi function create --name hello \
    --image node:15.14.0-alpine3.10 \
    --bundle hello \ 
    --entry "node hello.js"
```

At function initial stage, system downloads and extracts bundle contents to volume that 
can be accessed from function container under path `/userfunc`. Since the default work directory 
of function container is set to **/userfunc**, you can set the function entry to

```bash
node hello.js
```

or in absolute path format

```bash
node /userfunc/hello.js
```

## Create with container image or bundle ?

Here are some guidelines that can help you to decide which is better fit in your case.

* Portability of artifacts

From the aspect of portability, the container image has better portability compares to bundle.
Hence, an important thing to consider is **how hard to solve portability problem**.
For example, if Syntixi is installed at the client-side, then create with container image would be a better choice as 
the container image contains necessary execution environment and dependencies.

* Compiled or interpreted language

Compiled language normally requires developers to specify the target platform like OS and [ISA](https://en.wikipedia.org/wiki/Instruction_set_architecture)
during build time. For such cases, container image is an ideal way to solve problems above.

Interpreted language, on the other hand, is able to run on different type of machine as long as 
the container image contains necessary execution environment and dependencies.

* A function relies on things that are not part of application (Hybrid)

Assume you are creating a RESTful API service and one of the API requires a machine learning model to perform inference.
Since the ML model is not part of HTTP server source code and changes frequently, it's intuitive to seperated the HTTP service
and ML model. 

In this case, you can create a function with HTTP service image and referenced a bundle contains ML model. Once the
bundle is updated with the latest model, Syntixi will perform rolling update for function automatically.