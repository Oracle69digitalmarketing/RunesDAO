✅ Developer Documentation: RunesDAO+ — Cross-Chain Governance & Private Payments

This guide provides a comprehensive implementation blueprint for building RunesDAO+, a Starknet-based platform that enables Bitcoin holders to participate in DAOs and subscribe to services using gasless, privacy-preserving flows. It merges two powerful primitives: Runes-authenticated governance and ZK-TLS-based BTC subscriptions.

---

🧱 Architecture Overview

🔗 Core Components

| Layer | Tools |
|-------|------|
| Identity | RunesAuth + Xverse Wallet |
| Privacy | Wootzapp SDK + ZK-TLS |
| UX | AVNU Paymaster |
| Smart Contracts | Cairo + Starknet.js |
| Payments | BTC-backed assets via Atomiq SDK |

---

🛠️ Developer Implementation

1. RunesAuth Integration (Bitcoin Identity)
Use RunesAuth to verify Bitcoin ownership and sign DAO actions.

```js
const bitcoinAddress = await RunesAuth.connectXverseWallet()
const runesBalance = await RunesAuth.getRunesBalance(bitcoinAddress, runeId)
const signature = await RunesAuth.signRunesOwnership(bitcoinAddress, runeId)
```

Suggestions:
- Use Xverse Wallet for seamless Bitcoin UX.
- Cache signed ownership proofs for session reuse.

---

2. AVNU Paymaster Setup (Gasless UX)

```js
const paymasterRpc = new PaymasterRpc({
  nodeUrl: 'https://starknet.paymaster.avnu.fi',
  headers: { 'api-key': process.env.AVNUAPIKEY }
})

const account = new Account(provider, starknetAddress, signer, undefined, undefined, paymasterRpc)
```

Suggestions:
- Sponsor key DAO functions: registermember, vote, createproposal.
- Use daily budget limits to prevent abuse.

---

3. DAO Voting Flow

```js
const daoContract = new Contract(RunesDAOABI, getDaoAddress(runeId), account)

await account.executePaymasterTransaction(
  [daoContract.populate('register_member', [bitcoinAddress, runesBalance, signature])],
  { feeMode: { mode: 'sponsored' } }
)

await account.executePaymasterTransaction(
  [daoContract.populate('vote', [proposalId, support, signature])],
  { feeMode: { mode: 'sponsored' } }
)
```

Suggestions:
- Use Cairo to validate Runes signatures on-chain.
- Emit events for vote tracking and analytics.

---

4. Private Subscription Flow (Wootzapp SDK)

```js
const zkProof = await Wootzapp.generateZKSubscriptionToken(userId, planId)

const tx = {
  to: SubscriptionContract,
  data: encodeFunctionCall('authorize_payment', [zkProof, planId]),
  gasSponsor: { mode: 'sponsored' }
}

return paymaster.executeSponsoredTx(tx)
```

Suggestions:
- Use ZK-TLS for browser-native proof generation.
- Support recurring plans with expiry logic in Cairo.

---

5. Treasury Execution Contract (Cairo)

```python
func executetreasuryproposal(proposal_id, recipient, amount, asset):
    let proposal = dao.getproposal(proposalid)
    assert proposal.forvotes > proposal.againstvotes
    assert !proposal.executed
    assert currenttime() > proposal.endtime

    transfer_token(asset, recipient, amount)
    dao.markexecuted(proposalid)
    emit TreasuryTransfer(proposal_id, recipient, amount, asset)
```

Suggestions:
- Add multi-sig logic for high-value transfers.
- Use Starknet’s event system for audit trails.

---

🔄 Cross-Chain Value Flow (Atomiq SDK)

Use Atomiq for BTC ↔ Starknet swaps and Lightning support.

```js
const atomiq = init_atomiq({ network: 'mainnet' })

const bridgedBTC = await atomiq.bitcointostarknet(btcAmount, 'WBTC')
const usdcReserve = await atomiq.bitcointostarknet(btcAmount * 0.02, 'USDC')
```

Suggestions:
- Use Lightning for instant deposits.
- Reserve USDC for gas abstraction.

---

📱 Frontend UX (React Native)

- Use @starknet-react/core for Starknet interactions.
- Connect Xverse Wallet for Bitcoin flows.
- Hide Starknet internals; show BTC balances and APY.

---

🧪 Testing & Deployment

- Use Scarb for Cairo contract compilation.
- Use Foundry for simulation and fuzzing.
- Deploy contracts via Starknet CLI or Hardhat plugin.

---

📈 Future Extensions

- Add NFT-based DAO membership tiers.
- Integrate Troves/Endur for yield strategies.
- Enable Lightning withdrawals via Atomiq.

---

### Deployment Status
RunesDAO and Subscriptions contracts are compiled and verified locally.
Due to limited testnet funds, contracts are not yet deployed on Starknet Sepolia.
Deployment-ready artifacts are available in `/target/` and commands in `/scripts/deploy.sh`.

---

Sources: Based on technical briefs from HackMD Starknet Re{Solve}. https://hackmd.io/ @espejelomar/B1FjnFxigg