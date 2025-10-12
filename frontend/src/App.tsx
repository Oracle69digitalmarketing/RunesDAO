import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, Button, View, TextInput } from 'react-native';
import { StarknetConfig, InjectedConnector, useStarknet, useStarknetContract, useStarknetExecute } from '@starknet-react/core';
import { Subscriptions } from './Subscriptions';

// Mock RunesAuth object
const RunesAuth = {
  connectXverseWallet: async () => {
    return "bc1q..."; // Mock Bitcoin address
  },
  getRunesBalance: async (address: string, runeId: string) => {
    return 100; // Mock balance
  },
  signRunesOwnership: async (address: string, runeId: string) => {
    return "mock_signature"; // Mock signature
  }
};

const contractAddress = "0x0..."; // Placeholder
const simplifiedAbi = [
  {
    "type": "function",
    "name": "register_member",
    "inputs": [
      { "name": "bitcoin_address", "type": "felt252" },
      { "name": "runes_balance", "type": "u256" },
      { "name": "signature", "type": "felt252" }
    ],
    "outputs": [],
    "state_mutability": "external"
  },
  {
    "type": "function",
    "name": "vote",
    "inputs": [
      { "name": "proposal_id", "type": "u256" },
      { "name": "support", "type": "bool" },
      { "name": "signature", "type": "felt252" }
    ],
    "outputs": [],
    "state_mutability": "external"
  }
];

function App(): React.JSX.Element {
  const { account } = useStarknet();
  const { contract } = useStarknetContract({ abi: simplifiedAbi, address: contractAddress });
  const { execute: registerMember } = useStarknetExecute({ calls: [] });
  const { execute: vote } = useStarknetExecute({ calls: [] });


  const [bitcoinAddress, setBitcoinAddress] = useState<string | null>(null);
  const [runesBalance, setRunesBalance] = useState<number | null>(null);
  const [signature, setSignature] = useState<string | null>(null);
  const [proposalId, setProposalId] = useState<string>("");

  const handleConnectWallet = async () => {
    const runeId = "840000:84"; // Example rune ID
    const address = await RunesAuth.connectXverseWallet();
    setBitcoinAddress(address);
    const balance = await RunesAuth.getRunesBalance(address, runeId);
    setRunesBalance(balance);
    const sig = await RunesAuth.signRunesOwnership(address, runeId);
    setSignature(sig);
  };

  const handleRegisterMember = () => {
    if (contract && bitcoinAddress && runesBalance && signature) {
      const calls = contract.populate('register_member', [bitcoinAddress, runesBalance, signature]);
      registerMember({ calls });
    }
  };

  const handleVote = (support: boolean) => {
    if (contract && proposalId && signature) {
      const calls = contract.populate('vote', [proposalId, support, signature]);
      vote({ calls });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>RunesDAO</Text>
      <View style={styles.buttonContainer}>
        <Button title="Connect Bitcoin Wallet" onPress={handleConnectWallet} />
      </View>
      {bitcoinAddress && (
        <View style={styles.infoContainer}>
          <Text>Address: {bitcoinAddress}</Text>
          <Text>Runes Balance: {runesBalance}</Text>
          <Text>Signature: {signature}</Text>
        </View>
      )}

      {account ? (
        <View>
          <Text>Starknet Account: {account.address}</Text>
          <Button title="Register as Member" onPress={handleRegisterMember} />

          <View style={styles.voteContainer}>
            <TextInput
              style={styles.input}
              placeholder="Proposal ID"
              onChangeText={setProposalId}
              value={proposalId}
            />
            <Button title="Vote For" onPress={() => handleVote(true)} />
            <Button title="Vote Against" onPress={() => handleVote(false)} />
          </View>
          <Subscriptions />
        </View>
      ) : (
        <Text>Connect your Starknet wallet</Text>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 20,
  },
  buttonContainer: {
    marginBottom: 20,
  },
  infoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  voteContainer: {
    marginTop: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  }
});


const connectors = [
  new InjectedConnector({ options: { id: 'argentX' } }),
  new InjectedConnector({ options: { id: 'braavos' } }),
];

export default () => (
  <StarknetConfig connectors={connectors} autoConnect>
    <App />
  </StarknetConfig>
);
