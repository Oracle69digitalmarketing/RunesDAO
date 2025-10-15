import React, {useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  Button,
  View,
  TextInput,
  Alert,
} from 'react-native';
import {XionProvider, useAbstraxion} from '@burnt-labs/abstraxion-react-native';
import {PaymasterRpc} from '@avnu/paymaster-sdk';
import {initAtomiq} from '@atomiq/sdk';
import {Subscriptions} from './Subscriptions';
import {AVNU_API_KEY} from '@env';

function App(): React.JSX.Element {
  const {abstraxionAccount, isConnected, login, logout} = useAbstraxion();

  const [proposalId, setProposalId] = useState<string>('');
  const [btcAmount, setBtcAmount] = useState<string>('');

  const handleRegisterMember = async () => {
    if (abstraxionAccount) {
      console.log('Registering member...');
    }
  };

  const handleVote = (_support: boolean) => {
    if (abstraxionAccount && proposalId) {
      console.log(`Voting on proposal ${proposalId}`);
    }
  };

  const handleBridgeBTC = async () => {
    if (!btcAmount || isNaN(Number(btcAmount))) {
      Alert.alert(
        'Invalid Amount',
        'Please enter a valid amount of BTC to bridge.',
      );
      return;
    }
    try {
      const atomiq = initAtomiq({network: 'mainnet'});
      console.log(`Bridging ${btcAmount} BTC...`);
      const bridgedBTC = await atomiq.bitcoinToStarknet(
        Number(btcAmount),
        'WBTC',
      );
      console.log('Bridged BTC:', bridgedBTC);
      Alert.alert(
        'Bridge Successful',
        `${btcAmount} BTC has been bridged to WBTC on Starknet.`,
      );
    } catch (error) {
      console.error('Bridge failed:', error);
      Alert.alert(
        'Bridge Failed',
        'Could not bridge BTC. See console for details.',
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>RunesDAO+</Text>
      <View style={styles.buttonContainer}>
        {isConnected ? (
          <Button title="Logout" onPress={logout} />
        ) : (
          <Button title="Connect with XION" onPress={() => login()} />
        )}
      </View>

      {isConnected && abstraxionAccount ? (
        <View>
          <Text>Starknet Account: {abstraxionAccount.address}</Text>
          <Button title="Register as Member" onPress={handleRegisterMember} />

          <View style={styles.bridgeContainer}>
            <TextInput
              style={styles.input}
              placeholder="Amount of BTC to Bridge"
              onChangeText={setBtcAmount}
              value={btcAmount}
              keyboardType="numeric"
            />
            <Button title="Bridge BTC to Starknet" onPress={handleBridgeBTC} />
          </View>

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
          <Subscriptions abstraxionAccount={abstraxionAccount} />
        </View>
      ) : (
        <Text>Connect your wallet to get started.</Text>
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
  bridgeContainer: {
    marginTop: 20,
    borderTopWidth: 1,
    borderColor: '#ccc',
    paddingTop: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});

const paymaster = new PaymasterRpc({
  nodeUrl: 'https://starknet.paymaster.avnu.fi',
  headers: {'api-key': AVNU_API_KEY},
});

export default () => (
  <XionProvider paymaster={paymaster}>
    <App />
  </XionProvider>
);
