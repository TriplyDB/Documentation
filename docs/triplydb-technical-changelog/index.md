---
title: "TriplyDB "
path: "/docs/triplydb-technical-changelog"
---

[TOC]

This changelog covers technical changes related to TriplyDB on-premise deployments. See [here](/triplydb-changelog) for the TriplyDB changelog that is user facing.
This intent of this changelog is primarily for documenting breaking changes or changes that are useful to know when deploying/upgrading TriplyDB.


## 24.10.200 {#24.10.200}

The `.defaultImageRegistry` and `triplydbImageRegistry` fields are now removed.
If you used these fields, then you should instead reference the full image path (without the tag) for the images.

If you used `.defaultImageRegistry` with a custom registry, then set the full image tags for these keys:
- `mongodb.image`
- `redis.image`

If you used `.triplydbImageRegistry` with a custom registry, then set the full image tags for these keys:
- `api.image`
- `console.image`
- `orchestrator.image`

## 24.10.100 {#24.10.100}

None

## 24.9.200 {#24.9.200}

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
