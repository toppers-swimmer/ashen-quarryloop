# Ashen Quarryloop — Ops Notes

Lightweight operational notes for maintainers.

---

## Scope

This document covers:
- Network validation flow
- Dependency mapping rules
- Operational guardrails

---

## Validation Flow

When the application starts:

1. Load `config/base.networks.json`
2. Resolve the default network (`base-mainnet`)
3. Validate:
   - `chainId` is present
   - RPC endpoint is reachable
   - Explorer URL matches the network
4. Fall back to secondary RPCs if the primary fails

No network metadata should be hardcoded outside this config.

---

## Dependency Mapping

Dependencies must align with the **Base ecosystem**.

Mapping principles:
- Network data → static JSON config
- RPC access → Base public RPC endpoints
- Wallet / UX → Base-compatible SDKs
- Protocol features → explicitly documented dependencies

Avoid overlapping SDK responsibilities (one SDK per concern).

---

## Operational Checklist

Before merging or releasing:

- [ ] Base Mainnet RPC reachable
- [ ] Base Sepolia RPC reachable
- [ ] No secrets committed
- [ ] Network keys unchanged or documented
- [ ] Dependencies trace back to Base ecosystem
- [ ] Config changes reviewed separately from logic changes

---

## Notes

- Mainnet is always the operational default
- Sepolia is for testing only
- Any new Base network must be added via config, not code

_Last updated: initial ops scaffold_
