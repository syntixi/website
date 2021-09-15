---
title: "Syntixi"
sidebar_label: 'Introduction'
sidebar_position: 1
---

## Multi-Cloud Serverless Solution for Kubernetes

Syntixi is a Function-as-a-Service framework for Kubernetes based on [Fission](https://github.com/fission/fission).

## Kubernetes is the right place for Serverless

We're built on Kubernetes because we think any non-trivial app will
use a combination of serverless functions and more conventional
microservices, and Kubernetes is a great framework to bring these
together seamlessly.

Building on Kubernetes also means that anything you do for operations
on your Kubernetes cluster &mdash; such as monitoring or log
aggregation &mdash; also helps with ops on your Syntixi deployment.

## Getting Started and Documentation

### Documentations

You can learn more about Syntixi and get started from [documentation](https://docs.syntixi.dev/).
* Concepts: https://docs.syntixi.dev/concetps/
* Installation: https://docs.syntixi.dev/installation/

## Usage

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
  $ syntixi httptrigger create --method GET --url /hello --function hello

  # Run the function.  This takes about 100msec the first time.
  $ syntixi function test --name hello
  Hello, world!
```

## Official Releases

Official releases of Syntixi can be found on [the releases page](https://github.com/syntixi/syntixi/releases). 
Please note that it is strongly recommended that you use official releases of Syntixi, as unreleased versions from 
the master branch are subject to changes and incompatibilities that will not be supported in the official releases. 
Builds from the master branch can have functionality changed and even removed at any time without compatibility support 
and without prior notice.

## Licensing

Syntixi is an open core project maintained by [Syntixi](https://syntixi.dev/) and released under the Apache 2.0 license.