---
sidebar_label: 'Components'
sidebar_position: 99
---

# Components

## Controllers

The controller monitors changes in the Syntixi Custom Resource Definition (CRD) by
communicating with the Kubernetes API server. When a new CRD is created other than a Function,
the controller will create Kubernetes objects associated with the CRD for use by the Pod of the
Function in the future.

![controller](/img/architecture/controller-api-server-crd.jpg)

Additionally, the controller provides an upload API for clients to upload compressed code files
to storage when creating a bundle.

## Scheduler

When a Function is created, the Scheduler is responsible for creating Kubernetes objects associated with it, such as 
Deployment, Service, HPA, and so on.

If the resources referenced by the Function, such as Bundle or Config, are changed, the Scheduler will trigger a rolling 
upgrade of the Function pod to reflect the updates.

For multi-cloud/hybrid cloud scenarios, the Scheduler will deploy Function pods to the appropriate cluster based on the 
configuration and resource usage. When there are imbalances or abnormalities in different clusters, the 
Scheduler will automatically schedule the pods to other clusters to balance the load and improve service availability.

## Logger

The logger is responsible for collecting logs of Function pods from all nodes and sending them to InfluxDB 
for log persistence. Users can retrieve logs of a specific Function by using CLI commands for troubleshooting.

## Function Pod

When a Function is created, the Scheduler creates corresponding pods based on its content. The pod mainly consists of two containers:

* Runtime: the container that executes the user's application.
* Fetcher: the init container that downloads the Bundle archive referenced by the Function for the runtime container to execute when it starts.

## Storage

Currently, Syntixi only supports MinIO as the storage backend to store Bundle archives.

## Message Watcher

Syntixi supports event-trigger scenarios through the use of Message Watchers. 
When receiving a message from a specified topic, the watcher invokes the corresponding Function via an HTTP call.

Currently, a watcher only supports one type of message queue service. To support different types of message queue services, 
relevant watchers must be deployed beforehand to properly invoke the Function.




