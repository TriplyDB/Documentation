---
title: "TriplyDB "
path: "/docs/triplydb-technical-changelog"
---

[TOC]

This changelog covers technical changes related to TriplyDB on-premise deployments. See [here](/triplydb-changelog) for the TriplyDB changelog that is user facing.
This intent of this changelog is primarily for documenting breaking changes or changes that are useful to know when deploying/upgrading TriplyDB.

## 24.07.0 {#24.07.0}

### SAML

SAML configurations changed as follows:

- `api.env.TRIPLY__SAML__0__SIGNING_CERT` should be renamed to `TRIPLY__SAML__0__PUBLIC_CERT`
- `api.env.TRIPLY__SAML__0__CERT` should be renamed to `TRIPLY__SAML__0__IDP_CERT`

## 24.06.1 {#24.06.1}

None

## 24.06.0 {#24.06.0}

### Version tags

Version tags changed. If you have hardcoded versions in your values file (e.g. `api.version` or `console.version`), then remove the `-k8` postfix. 
E.g., change `24.05.1-k8` to `24.05.1`
