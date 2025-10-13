# RunesDAO+ Project Report

## 1. Introduction

RunesDAO+ is a proof-of-concept application that demonstrates a novel approach to decentralized governance and private, gasless subscriptions on the Starknet network. The project addresses two key challenges in the Web3 space:

*   **Accessible Governance:** It allows holders of Bitcoin Runes to participate in DAO governance without needing to bridge their assets to a different network.
*   **User-Friendly Subscriptions:** It enables users to subscribe to services using a privacy-preserving, gasless payment system.

By merging Runes-authenticated governance with ZK-TLS-based private subscriptions, RunesDAO+ provides a seamless and user-friendly experience for both Bitcoin and Starknet users.

## 2. Architecture

The RunesDAO+ platform is built on a multi-layered architecture that combines on-chain and off-chain components to deliver a secure and efficient user experience.

| Layer                  | Tools & Protocols                |
| ---------------------- | --------------------------------- |
| **Identity & Auth**      | RunesAuth + Xverse Wallet         |
| **Privacy Layer**        | Wootzapp SDK + ZK-TLS             |
| **Gasless UX**         | AVNU Paymaster                    |
| **Smart Contracts**     | Cairo + Starknet.js               |
| **Cross-Chain Payments** | Atomiq SDK (BTC-backed assets)    |

## 3. Technologies Used

*   **Starknet:** The core blockchain network for the smart contracts, providing high throughput and low transaction costs.
*   **Cairo:** The native language for writing Starknet smart contracts.
*   **React Native:** The framework for building the cross-platform mobile application.
*   **RunesAuth & Xverse Wallet:** For authenticating users based on their Bitcoin Runes holdings.
*   **Wootzapp SDK & ZK-TLS:** For generating and verifying zero-knowledge proofs for private subscriptions.
*   **AVNU Paymaster:** To enable gasless transactions, improving the user experience.
*   **Atomiq SDK:** For bridging Bitcoin to Starknet, enabling cross-chain value flow.
*   **Starknet.js & @starknet-react/core:** For interacting with the Starknet network from the frontend.

## 4. Features Implemented

### 4.1. Runes-Based DAO Membership & Voting

RunesDAO+ allows users to register as DAO members and vote on proposals based on their Bitcoin Runes holdings. The process is as follows:

1.  The user connects their Xverse Wallet to the application.
2.  The application uses RunesAuth to verify the user's ownership of a specific Rune.
3.  The user can then register as a member of the DAO and vote on proposals. The voting power can be proportional to the user's Rune balance.

This feature is implemented in the `RunesDAO` smart contract, which includes the following functions:

*   `register_member`: Registers a new member based on their Rune holdings.
*   `vote`: Allows a member to vote on a proposal.
*   `create_proposal`: Allows a member to create a new proposal.

### 4.2. Gasless Transactions with AVNU Paymaster

To provide a seamless user experience, RunesDAO+ uses the AVNU Paymaster to sponsor transactions for its users. This means that users can interact with the DAO and subscribe to services without needing to have ETH on their Starknet account to pay for gas fees.

The frontend application is configured to use the `avnuPaymasterProvider` from `@starknet-react/core`, which routes transactions through the AVNU Paymaster service.

### 4.3. Private Subscriptions with ZK-TLS Proofs

RunesDAO+ implements a private subscription model using the Wootzapp SDK and ZK-TLS proofs. This allows users to subscribe to services without revealing their identity or payment details on-chain.

The `Subscriptions` smart contract includes an `authorize_payment` function that verifies a ZK proof before authorizing a payment. This ensures that only valid subscribers can access the service.

### 4.4. Cross-Chain Value Flow with Atomiq SDK

The application integrates the Atomiq SDK to enable users to bridge their Bitcoin to Starknet in the form of WBTC. This allows for a seamless flow of value between the Bitcoin and Starknet ecosystems.

## 5. Deployment and Verification

The `RunesDAO` and `Subscriptions` contracts have been compiled and deployed to a local Starknet devnet for testing and verification. Due to limited testnet funds, the contracts have not yet been deployed to the Starknet Sepolia testnet.

*   **Local Devnet:** A local devnet was set up using `starknet-devnet-js` to provide a testing environment.
*   **Dummy Verifier:** For local testing, a `DummyVerifier` contract was created and deployed. This contract implements the `IReclaim` interface but does not perform any actual proof verification. In a production environment, this would be replaced with a real Reclaim Protocol Verifier contract.
*   **Deployment Artifacts:** The compiled contract artifacts are available in the `/target/` directory.
*   **Deployment Scripts:** The commands for deploying the contracts to the Starknet Sepolia testnet are available in the `/scripts/deploy.sh` file.

## 6. Future Extensions

RunesDAO+ is a foundational platform that can be extended with a variety of new features, including:

*   **NFT-Based Membership Tiers:** Introduce different membership tiers based on NFT ownership, providing different levels of access and governance rights.
*   **Yield Strategies:** Integrate with yield-generating protocols like Troves or Endur to allow the DAO to earn a return on its treasury.
*   **Lightning Withdrawals:** Enable users to withdraw their funds from the platform directly to the Bitcoin Lightning Network using the Atomiq SDK.

## 7. Conclusion

RunesDAO+ demonstrates the power of combining different Web3 primitives to create a novel and user-friendly application. By leveraging Runes-based identity, gasless transactions, and private subscriptions, RunesDAO+ provides a glimpse into the future of decentralized governance and Web3 applications.
