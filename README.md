# Ashen Quarryloop (Built for Base)

Ashen Quarryloop is a browser-first Base utility that validates network identity (chainId 8453 / 84532) and provides a strictly read-only surface for inspecting ETH balances, recent blocks, and ERC-20 token metadata with Basescan references.

---

## Repository layout

- app.ashen-quarryloop.ts  
  Frontend script rendering wallet connection and read-only Base RPC queries.

- config/base.networks.json  
  Static configuration describing supported Base networks and RPC endpoints.

- docs/ops.md  
  Lightweight operational notes covering validation flow and dependency mapping.

- contracts/  
  Solidity contracts deployed to Base Sepolia for testnet validation:
  - your_contract.sol — minimal deployment verification contract  
  - your_contract.sol — simple stateful interaction contract  
  - your_contract.sol — lightweight registry contract for read-only queries  

- package.json  
  Dependency manifest referencing Coinbase SDKs and multiple Base + Coinbase repositories.

- README.md  
  Technical documentation and testnet deployment references.

---

## Capabilities overview

- Coinbase Wallet connection (EIP-1193)  
- Base chainId verification (8453 / 84532)  
- ETH balance lookup for arbitrary addresses  
- Latest block snapshot with gas metrics  
- ERC-20 read-only metadata and balance queries  
- Direct Basescan references for verification  

---

## Base network context

Base Mainnet  
chainId (decimal): 8453  
Explorer: https://basescan.org  

Base Sepolia  
chainId (decimal): 84532  
Explorer: https://sepolia.basescan.org  

---

## Tooling and dependencies

- @coinbase/wallet-sdk  
- @coinbase/onchainkit  
- viem  
- Base GitHub repositories  
- Coinbase GitHub repositories  

---

## License

MIT License

Copyright (c) 2025 YOUR_NAME

---

## Author

GitHub: https://github.com/your-handle  
Email: you@example.com  
Public contact: https://x.com/your-handle  

---

## Testnet Deployment (Base Sepolia)

As part of pre-production validation, one or more contracts may be deployed to the Base Sepolia test network.

Network: Base Sepolia  
chainId (decimal): 84532  
Explorer: https://sepolia.basescan.org  

Contract #1 address:  
your_address

Deployment and verification:
- https://sepolia.basescan.org/address/your_address
- https://sepolia.basescan.org/your_address/0#code  

Contract #2 address:  
your_address

Deployment and verification:
- https://sepolia.basescan.org/address/your_address
- https://sepolia.basescan.org/your_address/0#code  

These testnet deployments provide a controlled environment for validating Base tooling, account abstraction flows, and read-only onchain interactions prior to Base Mainnet usage.
