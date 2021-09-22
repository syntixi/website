---
title: HTTP Trigger
sidebar_label: 'HTTP'
sidebar_position: 1
---

HTTP trigger exposes an internal function to public.

## How to create an HTTP trigger

:::caution

Do **NOT** create an http trigger that exposes at path `/` without specfying the target host (domain name) in production.
Otherwise, ingress controller will forward all requests to it.

:::

### Path Matching

Following command exposes your function at path `/` and accepts requests from all host.

```sh
# Demo only, do NOT do this in production cluster.
$ syntixi httptrigger create --name hello --function hello --path "/"
```

```
$ INGRESS_SERVICE_LOAD_BALANCER_IP=$(kubectl -n ingress-nginx get svc ingress-nginx-controller -o jsonpath='{...ip}')
$ curl http://${INGRESS_SERVICE_LOAD_BALANCER_IP}/
```

### Path Types

Each path is required to have a corresponding path type for path matching.

Use format `--path <path>=<path-type>` to specify path type, and `Exact` is used automatically if no path type is provided.  

```sh
$ syntixi httptrigger create --name hello --function hello --path "/foo/bar=Exact"
```

There are threee supported path types:

* `Exact`: **(default)** Matches the URL path exactly and with case sensitivity.

* `Prefix`: Matches based on a URL path prefix split by /. Matching is case sensitive and done on a path element by element basis. A path element refers to the list of labels in the path split by the / separator. A request is a match for path p if every p is an element-wise prefix of p of the request path.

* `ImplementationSpecific`: With this path type, matching is up to the ingress controller. Implementations can treat this as a separate pathType or treat it identically to Prefix or Exact path types.

Path Type     | Path(s)  | 	Request path(s) | Matches?
:-------------|---------:|-----------------:| :----
Exact         | /foo     |  /foo            | Yes
Exact         | /foo     |  /foo/           | No
Prefix        | /        |  (all paths)     | Yes
Prefix        | /foo     |  /foo, /foo/     | Yes
Prefix        | /foo/    |  /foo, /foo/     | Yes
Prefix        | /foo/    |  /foo            | Yes, ignores trailing slash
Prefix        | /foo/    |  /foo/           | Yes, matches trailing slash
Prefix	      | /aaa/bbb |  /aaa/bbb/ccc	| Yes, matches subpath
Prefix	      | /aaa/bbb |  /aaa/bbbxyz     | No, does not match string prefix
Mixed         | /foo (Prefix), /foo (Exact)	| /foo | Yes, prefers Exact

### Host

We strongly reommend to specify a target host (domain name) when exposing a function. It helps to avoid path conflicts if there are multiple functions are trying to expose at the same URL path.

Use `--host` to specify the target host of HTTP trigger.

```sh
$ syntixi ht create --name hello --path "/" --function hello --host example.com
$ curl -H 'Host: example.com' http://${INGRESS_SERVICE_LOAD_BALANCER_IP}/
```

### TLS

:::note

You will need a TLS config before continue. Visit [here](../core/config.md#file) to learn how to create it.

:::

Use `--tls` to specify which TLS config to use and assume you already created a TLS config named **tls-cfg**.

```sh
$ syntixi ht create --name hello --path "/" --function hello --host example.com --tls tls-cfg
$ curl --insecure -H 'Host: example.com' http://${INGRESS_SERVICE_LOAD_BALANCER_IP}/
```

## Supported Ingress Controller

Syntixi utilizes Kubernetes [ingress](https://kubernetes.io/docs/concepts/services-networking/ingress/) to offer TLS termination and path matching. In future, we plan to support more ingress controllers as well.

* [NGINX Ingress Controller](https://kubernetes.github.io/ingress-nginx/)