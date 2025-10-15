import React, {useState} from 'react';
import {View, Text, Button, TextInput, StyleSheet, Alert} from 'react-native';
import {Reclaim} from '@reclaim/sdk';
import {Account} from 'starknet';

const subscriptionContractAddress = '0x1...'; // Placeholder

export function Subscriptions({
  abstraxionAccount,
}: {
  abstraxionAccount: Account | null;
}): React.JSX.Element {
  const [planId, setPlanId] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleSubscribe = async () => {
    if (!abstraxionAccount || !planId) {
      return;
    }

    setIsSubscribing(true);
    try {
      const reclaim = new Reclaim();
      const requestedProofs = [
        reclaim.requestProofs({
          title: 'GitHub Account',
          baseCallbackUrl: 'https://runesdao.xyz/callback',
          provider: 'github-contributor',
          context: 'RunesDAO Subscription',
        }),
      ];

      const proofRequestUrl = await reclaim.getReclaimUrl(requestedProofs);
      console.log('Open this URL to generate a proof:', proofRequestUrl);

      // **SIMULATION:** In a real app, you'd get this from your backend after the user provides the proof.
      const simulatedProof = 'mock_zk_proof_from_reclaim';

      await abstraxionAccount.execute({
        contractAddress: subscriptionContractAddress,
        entrypoint: 'authorize_payment',
        calldata: [simulatedProof, planId],
      });

      Alert.alert('Subscription successful!');
    } catch (error) {
      console.error('Subscription failed:', error);
      Alert.alert('Subscription failed', 'See console for details.');
    } finally {
      setIsSubscribing(false);
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
      <Button
        title={isSubscribing ? 'Subscribing...' : 'Subscribe with Reclaim'}
        onPress={handleSubscribe}
        disabled={!abstraxionAccount || isSubscribing}
      />
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
