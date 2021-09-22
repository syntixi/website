---
sidebar_label: 'Components'
sidebar_position: 0
---

# Components

## Syntixi

### Controllers

Controller exposes APIs for CLI operations like uploading archive and most importantly it 
serves two admission control webhooks for mutating and validating resources. 
(See [dynamic admission controller](https://kubernetes.io/docs/reference/access-authn-authz/extensible-admission-controllers/) for more information.)

### Scheduler

Scheduler creates Kubernetes resources (Deployment, Service, HPA) when a 
[function](../guides/core/function.md) is created. If any of resource like 
[bundle](../guides/core/bundle.md) and [config](../guides/core/config.md) is changed, 
scheduler performs rolling update for functions that reference the changed resource.

For multi-cluster scenario (coming soon), scheduler deploys function containers to cluster that 
fullfils resource requirement and re-balance workloads between clusters to match given condition.
In other word, it reduces effort for maintaining Kubernetes clusters and allows SREs to focus on
more valuable tasks.

### Router

Router works as a smart proxy that redirects requests to functions. Under the hood, it uses 
[Zenvoy](https://github.com/rueian/zenvoy) to collect metrics from envoy then stream metrics to 
scheduler for workload scheduling. It allows us to offer better perofmance and obserability of 
whole system.

### Message Processor

Message processor is for Syntixi to invoke message queue trigger when receiving message from
specific message queue topic. 

As of now, a message process can only supports to subscribe/publish messages from/to one message
queue at the same time. To support different message queue type, a dedicated message processor
for that message queue type must be deployed.

### Logger

Logger collects container logs on each node and sends data to influxdb for log persistence. 

## Function

### Runtime

Runtime is a container that executes user-defined entry. 

### Fetcher

Fetcher is a init container that only added to Pod when one function reference a bundle resource.
It downloads archive to volume for runtime container to load at bootstrapping and calculates 
SHA256 checksum to ensure file integrity.




