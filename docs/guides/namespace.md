---
sidebar_label: 'Namespace'
sidebar_position: 0
---

# Namespace

## Namespaced Resources

**Namespaced resources** are resources created in a dedicated namespace and 
can only reference other namespaced resources in the same namespace. It allows
users in different teams or projects to manage their own resources.

## Managed Namespace

By default, Syntixi only manages namespaces with label `app.kubernetes.io/managed-by=syntixi`.
In order to join the fleet, you have to label a namespace with command:

```sh
$ kubectl label namespace <namespace> app.kubernetes.io/managed-by=syntixi
```

After labeling `default` namespace (or any other namesapce), you shall see

```sh
$ kubectl get namespace --show-labels
NAME      STATUS   AGE     LABELS
default   Active   174d    app.kubernetes.io/managed-by=syntixi
```

## Create Namespaced Resources

Syntixi CLI reads `$HOME/.kube/config` and use current context for CLI operations like create, update and delete.

```sh
# View current context
$ kubectl config view --minify

# Set namespace for CLI operations
$ kubectl config set-context --current --namespace=<namespace>

# View current namespace
$ kubectl config view --minify --output 'jsonpath={..namespace}'
```

Assume the current namespace is `default`, the bundle resource will be created in
`default` namespace with command.

```sh
$ syntixi bundle create --name hello --code hello.js
```

You can also add `--namespace` or in short `-n` to change namespace for CLI operations.

```sh
$ syntixi --namespace <namespace> bundle create --name hello --code hello.js
```

## No Cross Namespace Reference

Namespaced resources cannot be refereneced by other namespaced resources located in different
namespaces.

Let's say you create a function in namespace `foobar` and want to references a bundle in 
namespace `default`, CLI will return an error shows `resource not found` due to 
two resources are not in the same namespace and so system cannot find bundle named
`hello` in namesapce `foobar`.

```sh
$ syntixi -n foobar function create --name hello --bundle hello --image nginx
Error: Bundle needs to be present in the same namespace 'foobar' as function 'hello': 
bundles.core.syntixi.dev "hello" not found
```

By disabling cross namespace reference not only reduces complextity when developing Syntixi, 
it also brings lots of benefits like supporting mulit-tenant scenario and providing 
strong namespace isolation to avoid any potential security issues.