# RunesDAO+ Architecture Diagram

This document provides a high-level overview of the RunesDAO+ architecture, illustrating the different components and their interactions.

## Components

The RunesDAO+ platform is composed of the following key components:

*   **Frontend (React Native App):** The user-facing mobile application that provides the user interface for interacting with the platform.
*   **Xverse Wallet:** A Bitcoin wallet that is used for authenticating users based on their Bitcoin Runes holdings.
*   **RunesAuth:** A service that verifies the ownership of Bitcoin Runes.
*   **Wootzapp SDK & Reclaim Protocol:** A set of tools and services for generating and verifying ZK-TLS proofs of off-chain data.
*   **AVNU Paymaster:** A service that sponsors gas fees for users, providing a gasless transaction experience.
*   **Starknet:** The blockchain network where the smart contracts are deployed.
*   **RunesDAO Contract:** The smart contract that governs the DAO, including membership and voting.
*   **Subscriptions Contract:** The smart contract that manages user subscriptions.
*   **DummyVerifier Contract:** A placeholder contract for the Reclaim Protocol verifier.
*   **Atomiq SDK:** A service for bridging Bitcoin to Starknet.

## Architecture Diagram

```
+------------------------+
|                        |
|    React Native App    |
|      (Frontend)        |
|                        |
+-----------+------------+
            |
            | 1. Connect Wallet
            v
+-----------+------------+
|                        |
|     Xverse Wallet      |
|                        |
+-----------+------------+
            |
            | 2. Sign Ownership
            v
+-----------+------------+
|                        |
|       RunesAuth        |
|                        |
+------------------------+

+------------------------+
|                        |
|    React Native App    |
|      (Frontend)        |
|                        |
+-----------+------------+
            |
            | 3. Generate Proof
            v
+-----------+------------+
|                        |
|      Wootzapp SDK      |
|                        |
+-----------+------------+
            |
            | 4. Get Data
            v
+-----------+------------+
|                        |
|    Reclaim Protocol    |
|                        |
+------------------------+

+------------------------+
|                        |
|    React Native App    |
|      (Frontend)        |
|                        |
+-----------+------------+
            |
            | 5. Send Transaction
            v
+-----------+------------+
|                        |
|     AVNU Paymaster     |
|                        |
+-----------+------------+
            |
            | 6. Sponsor Gas
            v
+-----------+------------+
|                        |
|        Starknet        |
|   (Sepolia Testnet)    |
|                        |
+--+------------------+--+
   |                  |
   | 7. Interact with |
   |    Contracts     |
   |                  |
+--v------------------v--+
|                        |
|   RunesDAO Contract    |
| Subscriptions Contract |
|  DummyVerifier Contract|
|                        |
+------------------------+

+------------------------+
|                        |
|    React Native App    |
|      (Frontend)        |
|                        |
+-----------+------------+
            |
            | 8. Bridge BTC
            v
+-----------+------------+
|                        |
|       Atomiq SDK       |
|                        |
+-----------+------------+
            |
            | 9. Bridge to WBTC
            v
+-----------+------------+
|                        |
|        Starknet        |
|   (Sepolia Testnet)    |
|                        |
+------------------------+
```

## Interaction Flow

1.  **Connect Wallet:** The user connects their Xverse Wallet to the React Native app.
2.  **Sign Ownership:** The user signs a message with their Xverse Wallet to prove ownership of their Bitcoin Runes. This signature is verified by the RunesAuth service.
3.  **Generate Proof:** The user initiates a process to generate a ZK-TLS proof of their off-chain data (e.g., GitHub identity) using the Wootzapp SDK.
4.  **Get Data:** The Wootzapp SDK interacts with the Reclaim Protocol to get the necessary data for generating the proof.
5.  **Send Transaction:** The user sends a transaction to the Starknet network through the React Native app.
6.  **Sponsor Gas:** The AVNU Paymaster intercepts the transaction and pays for the gas fees on behalf of the user.
7.  **Interact with Contracts:** The transaction interacts with the `RunesDAO`, `Subscriptions`, or `DummyVerifier` contracts on the Starknet Sepolia testnet.
8.  **Bridge BTC:** The user can bridge their Bitcoin to Starknet using the Atomiq SDK.
9.  **Bridge to WBTC:** The Atomiq SDK handles the process of converting Bitcoin to WBTC on Starknet.
