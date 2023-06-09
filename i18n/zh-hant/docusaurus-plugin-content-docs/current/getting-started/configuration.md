---
sidebar_label: 'Configuration'
sidebar_position: 2
---

# Configuration

## Controller

Parameter | Description 
--------- | ----------- 
`controller.service.port` | Listening port for in-cluster access
`controller.service.nodeport` | Node port for external access
`controller.service.type` | Kubernetes service type for controller service

```yaml
controller:
  service:
    port: 80
    nodeport: 31313
    type: ClusterIP
```

## Message Watcher

### NATS Streaming

NATS Streaming is deployed and enabled by default.

Parameter | Description 
--------- | ----------- 
`messageWatcher.nats.enabled` | Enable message watcher for NATS Streaming
`messageWatcher.nats.service.nodeport` | Node port for external access
`messageWatcher.nats.service.type` | Kubernetes service type
`messageWatcher.nats.authToken` | Auth token
`messageWatcher.nats.clusterID` | Cluster ID

### Kafka

Kafka message watcher requires a list of accessible brokers and proper configurations to work.

Parameter | Description 
--------- | ----------- 
`messageWatcher.kafka.enabled` | Enable message watcher for Kafka
`messageWatcher.kafka.brokers` | List of brokers, separated by `,`
`messageWatcher.kafka.authentication.tls.enabled` | Enable TLS Client Authentication
`messageWatcher.kafka.authentication.tls.caCert` | Local path to CA certificate, like `auth/kafka/ca.crt`
`messageWatcher.kafka.authentication.tls.userCert` | Local path to TLS certificate, like `auth/kafka/user.crt`
`messageWatcher.kafka.authentication.tls.userKey` | Local path to TLS key file, like `auth/kafka/user.key`
`messageWatcher.kafka.version` | Kafka version

```yaml
messageWatcher:
  nats:
    enabled: true
    service:
      nodeport: 31316
      type: ClusterIP
    authToken: "defaultSyntixiAuthToken"
    clusterID: "syntixiMsgWatcher"

  kafka:
    enabled: false
    brokers: 'broker.kafka:9092' # or your-bootstrap-server.kafka:9092/9093
    authentication:
      tls:
        enabled: false
        caCert: '' # path to certificate containing public key of CA authority
        userCert: '' # path to certificate containing public key of the user signed by CA uthority
        userKey: '' # path to private key of the user
  
    ## version of Kafka broker
    ## For 0.x it must be a string in the format
    ## "major.minor.veryMinor.patch" example: 0.8.2.0
    ## For 1.x it must be a string in the format
    ## "major.major.veryMinor" example: 2.0.1
    ## Should be >= 0.11.2.0 to enable Kafka record headers support
    # version: "0.11.2.0"
```

## Logger

Parameter | Description 
--------- | ----------- 
`logger.influxdb.admin` | Admin username for accessing InfluxDB
`logger.influxdb.password` | Admin password for accessing InfluxDB
`logger.privileged` | Fluent-bit maintains it's own sqlite database and requires permission to write files to hostPath volume for state recovering. Set to `true` if you're running on constraints Kubernetes environment like OpenShift.

```yaml
logger:
  influxdb:
    admin: "defaultAdmin"
    password: "defaultPassword"
  privileged: false
```

## Fetcher

Fetcher is for function runtime to download archive at init stage. Normally, you don't
need to change this unless necessary.

Parameter | Description 
--------- | ----------- 
`fetcher.resource.cpu.requests` | Minimum CPU resource requirement
`fetcher.resource.cpu.limits` | Maximum CPU resource (Low CPU limits may increase function specialization time)
`fetcher.resource.mem.requests` | Minimum memory resource requirement
`fetcher.resource.mem.limits` | Maximum memory resource

```yaml
fetcher:
  resource:
    cpu:
      requests: "10m"
      limits: ""
    mem:
      requests: "16Mi"
      limits: ""
```

## Storage

A standalone minio server is deployed during Helm chart installation and
it helps users to start playing Syntixi without manually install Minio. 
For production setup, use [Minio operator](https://github.com/minio/operator/tree/master/helm/minio-operator) 
to bootstraps a high-availability Minio clusters and update configuration accordingly.

Parameter | Description 
--------- | ----------- 
`storage.type` | Storage service type, currently we only support Minio.
`storage.installStorageService` | Install standalone Minio service, set to `false` if you install it manually
`storage.persistence.enabled` | Use persistent volume for Minio server. Set to `false` if you're environment doesn't support persistent volume, however, you may lost all data once minio container is getting deleted
`storage.persistence.storageClassName` | Storage class name for persistent volume. Cluster's default storage class name will be used if not defined
`storage.persistence.size` | Size of persistent volume in `Gi`
`storage.config.endpoint` | Minio access endpoint in format `<host>:<port>`
`storage.config.accessID` | Minio access key 
`storage.config.secretKey` | Minio secret key
`storage.config.ignoreSSLValidation` | Ignore SSL validation. Set to `false` if use self-signed certificate.
`storage.config.useSSL` | Access Minio with HTTPs or HTTP protocol

```yaml
storage:
  type: minio
  installStorageService: true
  persistence:
    enabled: true
    storageClassName: ""
    size: 1Gi
  config:
    endpoint: "minio.syntixi.svc.cluster.local:9000"
    accessID: "default-storage-accessid"
    secretKey: "default-storage-secretkey"
    ignoreSSLValidation: false
    useSSL: false
```

## Webhook Cert Generator

Kubernetes requires HTTPs for [admission webhook](https://kubernetes.io/docs/reference/access-authn-authz/extensible-admission-controllers/)
endpoints. We uses a auto script that utilize Kubernetes [CSR API](https://kubernetes.io/docs/reference/access-authn-authz/certificate-signing-requests/) 
to a generate a certificate signed by Kubernetes CA. (Normally you don't have to change this 
config unless you are 100% sure what you're doing.)

Parameter | Description 
--------- | ----------- 
`webhookCertGenerator.secret` | Secret to store generated certificates
`webhookCertGenerator.service` | Service name of controller service for generating certs.

```yaml
webhookCertGenerator:
  secret: webhook-crt
  service: controller
```

## Component Pod Scheduling Config

Add scheduling contranits to core component pods. It's useful when you want to constrain 
core componets can only run on particular set nodes. 

Parameter | Description 
--------- | ----------- 
`componentPodSchedulingConfig.affinity` | [Reference](https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/#affinity-and-anti-affinity)
`componentPodSchedulingConfig.tolerations` | [Reference](https://kubernetes.io/docs/concepts/scheduling-eviction/taint-and-toleration/)
`componentPodSchedulingConfig.nodeSelector` | [Reference](https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/#nodeselector)

```yaml
componentPodSchedulingConfig:
#  affinity:
#    nodeAffinity:
#      requiredDuringSchedulingIgnoredDuringExecution:
#        nodeSelectorTerms:
#          - matchExpressions:
#            - key: capability
#              operator: In
#              values:
#                - app
#  tolerations:
#  nodeSelector:
```

## Enable debug message

Parameter | Description 
--------- | ----------- 
`debugEnv` | Enable debug message

```yaml
debugEnv: false
```

## Prometheus

Parameter | Description 
--------- | ----------- 
`prometheus.enabled` | Set to `true` if prometheus needs to be deployed along with syntixi
`prometheus.endpoint` | If enabled is false, please assign prometheus service endpoint that is accessible by components.

```yaml
prometheus:
  enabled: false
  endpoint: ""
```

## Grafana-operator
Parameter | Description
--------- | ----------- 
`grafana_operator.installed` | Set to `true` if grafana-operator needs to be deployed along with syntixi
`grafana_operator.enabled` | Set to `true` if you want to using Syntixi monitoring mechanism.
`grafana_operator.grafana.url` | Url to call grafana.  Use to create grafana-operator grafana resource. Default value is kube-prometheus's default grafana url.
`grafana_operator.grafana.user` | Grafana login user. Use to create grafana-operator grafana resource. Default value is kube-prometheus's default grafana user.
`grafana_operator.grafana.password` | Grafana login user corresponding password. Use to create grafana-operator grafana resource. Default value is kube-prometheus's default grafana pasword.

```yaml
grafana_operator:
  install: true
  enabled: true
  grafana:
    url : "http://grafana.monitoring.svc.cluster.local:3000" # kube-prometheus grafana default FQDN
    user: "admin"
    password: "admin"
```