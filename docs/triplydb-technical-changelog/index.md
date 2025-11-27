---
title: "TriplyDB technical changelog"
path: "/docs/triplydb-technical-changelog"
---

[TOC]

This changelog covers technical changes related to TriplyDB on-premise deployments. See [here](/triplydb-changelog) for the TriplyDB changelog that is user facing.


## 25.11.200 {#25.11.200}

**Release date:** 2025-11-27

- Added Prometheus ServiceMonitor support for API pod metrics collection. Configure via `api.metrics.serviceMonitor.enabled` (default: `false`). When enabled, a ServiceMonitor resource is created with configurable scrape interval, timeout, and labels. The implementation uses hashmod relabeling to scrape only one API replica, preventing duplicate metrics across multiple pods.
- API network policy updated to allow Prometheus ingress when ServiceMonitor is enabled. The network policy configuration is specified via `api.metrics.serviceMonitor.networkPolicy.prometheusIngressSelector` and supports custom namespace and pod selectors for Prometheus access.

## 25.11.100 {#25.11.100}

**Release date:** 2025-11-12

- API service account RBAC permissions expanded: added `deployments` resource permissions
  (`get`, `list`) for `apps` API group better monitoring and management.
- PersistentVolumeClaim and Service creation now support owner references for proper garbage collection. This ensures Kubernetes automatically cleans up related resources when parent resources are deleted.

## 25.10.300 {#25.10.300}

**Release date:** 2025-10-29

- SAML authentication attribute mapping configuration changed. The `auth.saml[*].attributeMappings` structure now supports additional properties for attribute updates. Added `allowOverwrite` boolean property to control whether attributes can be updated on subsequent logins (default: `false`). Added `expiresAt` and `displayedName` attribute mappings for temporary user accounts. Existing SAML configurations will continue to work as is
- Added `indexJobs.maxJsonLdFileSizeMb` configuration property (default: `50`). This limits the maximum size of JSON-LD files during index job processing to prevent memory issues with very large files. The environment API variable `TRIPLY__JSONLD_MAX_BYTES_SIZE` is not allowed anymore.
- Removed `speedy.maxNumberOfStatementsInMemory` configuration property. Memory handling for SPARQL operations is now managed automatically without a fixed statement limit, improving support for large result sets.

## 25.10.200 {#25.10.200}

**Release date:** 2025-10-16

- Node.js upgraded from version 22 to version 24. All TriplyDB container images now use Node.js 24 as the base runtime. This affects all pods including API, console, orchestrator, and job runners. 
- Redis upgraded from version 7.4.2 to 8.2.2 to address security vulnerabilities. Note that the security vulnerability in question could not have been abused in the context of the TriplyDB deployment.
- Added `indexJobs.legacyDelimitedFormat` configuration property (default: `true`). This controls CSV/TSV import behavior. When set to `true`, uses the legacy simple format. When set to `false`, uses the new format which supports more complex table structures but produces more verbose RDF output. 

## 25.10.100 {#25.10.100}

**Release date:** 2025-10-02

- API service account RBAC permissions changed: added `leases` resource permissions (`get`, `list`, `watch`, `create`, `update`, `patch`) for coordination.k8s.io API group. This enables proper Kubernetes leader election coordination for watching job events.
- Orchestrator service account removed: orchestrator pods now use default namespace permissions instead of dedicated service account. The orchestrator deployment no longer specifies a `serviceAccountName`.

## 25.9.100 {#25.9.100}

**Release date:** 2025-09-18

None

## 25.8.200 {#25.8.200}

**Release date:** 2025-08-28

None

## 25.08.100 {#25.08.100}

**Release date:** 2025-08-06

None

## 25.7.100 {#25.7.100}

**Release date:** 2025-07-16

None

## 25.6.200 {#25.6.200}

**Release date:** 2025-06-26

None

## 25.6.100 {#25.6.100}

**Release date:** 2025-06-05

None

## 25.5.100 {#25.5.100}

**Release date:** 2025-05-14

None

## 25.4.300 {#25.4.300}

**Release date:** 2025-04-28

None


## 25.4.200 {#25.4.200}

**Release date:** 2025-04-16

None

## 25.4.100 {#25.4.100}

**Release date:** 2025-04-03

None


## 25.3.200 {#25.3.200}

**Release date:** 2025-04-20

None


## 25.3.100 {#25.3.100}

**Release date:** 2025-03-06

**Features**

- SAML can now be configured through native helm values, instead of using environment variables for the API pod. I.e., A configuration like this:
```yaml
api:
  env:
    TRIPLY__SAML__0__ENTRY_POINT: some_entrypoint_url
    TRIPLY__SAML__0__IDP: some_idp_id
    TRIPLY__SAML__0__IDP_ATTRIBUTE_MAPPINGS__EMAIL__KEY: http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress
    TRIPLY__SAML__0__IDP_ATTRIBUTE_MAPPINGS__NAME__KEY: http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier
    TRIPLY__SAML__0__ISSUER: some_issuer_id
    TRIPLY__SAML__0__LABEL: Login with SAML
    TRIPLY__SAML__0__SIGNATURE_ALGORITHM: RSA_SHA256
    TRIPLY__SAML__0__SUPPORT_IDP_LOGOUT: "false"
    TRIPLY__SAML__0__WANT_AUTHN_RESPONSE_SIGNED: "false"
    TRIPLY__SAML__0__IDP_CERT:
      valueFrom:
        secretKeyRef:
          name: saml-credentials-0
          key: CERT
    TRIPLY__SAML__0__PRIVATE_KEY:
      valueFrom:
        secretKeyRef:
          name: saml-credentials-0
          key: PRIVATE_KEY
    TRIPLY__SAML__0__PUBLIC_CERT:
      valueFrom:
        secretKeyRef:
          name: saml-credentials-0
          key: SIGNING_CERT
    TRIPLY__SAML__0__DECRYPTION_CERT:
      valueFrom:
        secretKeyRef:
          name: saml-credentials-0
          key: DECRYPTION_CERT
    TRIPLY__SAML__0__DECRYPTION_PVK:
      valueFrom:
        secretKeyRef:
          name: saml-credentials-0
          key: DECRYPTION_PVK
```
will now be set like this:
```yaml
auth:
  saml:
    some_idp_id:
      entryPoint: some_entrypoint_url
      issuer: some_issuer_id
      label: Login with SAML
      signatureAlgorithm: RSA_SHA256
      idpAttributeMappings:
        email:
          key: http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress
        name:
          key: http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier
      additionalConfig:
        wantAuthnResponseSigned: false
        supportIdpLogout: false
      idpCertSecret:
        name: saml-credentials-0
        key: CERT
      spCertSecret:
        name: saml-sp-certs
```

Note that:

- The IDP ID is now the key of the helm values object.
- Certificates can only be set through secrets. For the IDP certificates this can be any secret with any field. For the SP certificate we expect a secret of type `TLS`, containing the private key and the public certificate.

## 25.2.200 {#25.2.200}

**Release date:** 2025-02-20

None

## 25.2.100 {#25.2.100}

**Release date:** 2025-02-06

- The type `tdbServices.customLabels` changed from an array to an object. I.e., change
  this:
```
tdbServices:
  customLabels:
  - VAL=KEY
```
to:
```
tdbServices:
  customLabels:
    VAL: KEY
```


## 25.1.200 {#25.1.200}

**Release date:** 2025-01-23

- `disablePreUpgradeHook` setting is no longer needed. If you have set this, you can
  safely remove it

## 25.1.100 {#25.1.100}

**Release date:** 2025-01-09

- `indexJobs.storageClassName` and `queryJobs.storageClassName` are both required properties now.
- `tdbServices.podNodeAffinity` and `tdbServices.podTolerations` now take a yaml string as
  argument, instead of a yaml object.
- `indexJobs.chunkSize` must now be a number and not a string
- Some properties from the values file are now propagated to the console and API via a
  configmap. This change _only_ affects on-premise deployments where the helm manifests
  are post-processed and manipulated.

## 24.12.200 {#24.12.200}

**Release date:** 2024-12-18

None

## 24.12.104 {#24.12.104}

**Release date:** 2024-12-06

- The `.disableNetworkPolicies` property is removed. Instead, use the
  `networkPolicies.enabled` property.
- The API and console apply stricter network policies. As a consequence, you will need to
  specify a source selector that references your ingress. See the [kubernetes
  documentation](https://kubernetes.io/docs/concepts/services-networking/network-policies/#behavior-of-to-and-from-selectors)
 for more info on such selectors. Specify this selector in
  `networkPolicies.ingressSelector`. An example definition is the following:

```
networkPolicies:
  ingressSelector:
    namespaceSelector:
      matchLabels:
        kubernetes.io/metadata.name: ingress-nginx
```


## 24.11.200 {#24.11.200}

**Release date:** 2024-11-22

None

## 24.11.100 {#24.11.100}

**Release date:** 2024-11-08

None

## 24.10.200 {#24.10.200}

**Release date:** 2024-10-25

The `.defaultImageRegistry` and `triplydbImageRegistry` fields are now removed.
If you used these fields, then you should instead reference the full image path (without the tag) for the images.

If you used `.defaultImageRegistry` with a custom registry, then set the full image tags
for these keys:

- `mongodb.image`
- `redis.image`
- `kubernetesWaitFor.image`

If you used `.triplydbImageRegistry` with a custom registry, then set the full image tags
for these keys:

- `api.image`
- `console.image`
- `orchestrator.image`
- `indexJobs.image`
- `queryJobs.image`
- `tdbServices.virtuoso.image`
- `tdbServices.jena.image`
- `tdbServices.elastic.image`
- `tdbServices.blazegraph.image`

## 24.10.100 {#24.10.100}

**Release date:** 2024-10-11

None

## 24.9.200 {#24.9.200}

**Release date:** 2024-09-27

None

## 24.9.100 {#24.9.100}

The version scheme for the TriplyDB helm charts changed. This is now reflected in this technical changelog.

- `indexingChunkSize` (if present) should move to `indexJobs.chunkSize`
- `queryJobs.nodeMemoryLimitInGb` is renamed to `queryJobs.nodejsMemoryLimitInGb`

## 24.08.1 {#24.08.1}

None

## 24.08.0 {#24.08.0}

The `service-orchestrator` key is renamed to `orchestrator`

## 24.07.1 {#24.07.1}

None

## 24.07.0 {#24.07.0}

### SAML

SAML configurations changed as follows:

- `api.env.TRIPLY__SAML__0__SIGNING_CERT` should be renamed to `TRIPLY__SAML__0__PUBLIC_CERT`
- `api.env.TRIPLY__SAML__0__CERT` should be renamed to `TRIPLY__SAML__0__IDP_CERT`

## 24.06.1 {#24.06.1}

None

## 24.06.0 {#24.06.0}

### Version tags

- Version tags changed. If you have hardcoded versions in your values file (e.g. `api.version` or `console.version`), then remove the `-k8` postfix. E.g., change `24.05.1-k8` to `24.05.1`
- The `tdbServices.[service-name].tag` property changed to `tdbServices.[service-name].version`
