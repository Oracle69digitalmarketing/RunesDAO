import React, { useState } from 'react';
import { View, Text, Button, TextInput, StyleSheet } from 'react-native';
import { useStarknet, useStarknetContract, useStarknetExecute } from '@starknet-react/core';

// Mock Wootzapp SDK
const Wootzapp = {
  generateZKSubscriptionToken: async (userId: string, planId: string) => {
    return "mock_zk_proof";
  }
};

const subscriptionContractAddress = "0x1..."; // Placeholder
const subscriptionAbi = [
  {
    "type": "function",
    "name": "authorize_payment",
    "inputs": [
      { "name": "zk_proof", "type": "felt252" },
      { "name": "plan_id", "type": "felt252" }
    ],
    "outputs": [],
    "state_mutability": "external"
  }
];

export function Subscriptions(): React.JSX.Element {
  const { account } = useStarknet();
  const { contract } = useStarknetContract({ abi: subscriptionAbi, address: subscriptionContractAddress });
  const { execute: authorizePayment } = useStarknetExecute({ calls: [] });

  const [planId, setPlanId] = useState("");

  const handleSubscribe = async () => {
    if (account && contract && planId) {
      const zkProof = await Wootzapp.generateZKSubscriptionToken(account.address, planId);
      const calls = contract.populate('authorize_payment', [zkProof, planId]);
      authorizePayment({ calls });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Private Subscriptions</Text>
      <TextInput
        style={styles.input}
        placeholder="Plan ID"
        onChangeText={setPlanId}
        value={planId}
      />
      <Button title="Subscribe" onPress={handleSubscribe} disabled={!account} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    width: 200,
  },
});
