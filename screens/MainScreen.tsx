/*eslint-disable */
import React, {useCallback, useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';

import {Section} from '../components/Section';
import ConnectButton from '../components/ConnectButton';
import AccountInfo from '../components/AccountInfo';
import {
  useAuthorization,
  Account,
} from '../components/providers/AuthorizationProvider';
import {useConnection} from '../components/providers/ConnectionProvider';
import DisconnectButton from '../components/DisconnectButton';
import RequestAirdropButton from '../components/RequestAirdropButton';
import SignMessageButton from '../components/SignMessageButton';
import SignTransactionButton from '../components/SignTransactionButton';
import { checkBiometrics, loginWithBiometrics } from '../components/utils/Biometrics';
import ReactNativeBiometrics, { BiometryTypes } from 'react-native-biometrics'

export default function MainScreen() {
  const {connection} = useConnection();
  const {selectedAccount} = useAuthorization();
  const [balance, setBalance] = useState<number | null>(null);
  const rnBiometrics = new ReactNativeBiometrics()
  const fetchAndUpdateBalance = useCallback(
    async (account: Account) => {
      console.log('Fetching balance for: ' + account.publicKey);
      const fetchedBalance = await connection.getBalance(account.publicKey);
      console.log('Balance fetched: ' + fetchedBalance);
      setBalance(fetchedBalance);
    },
    [connection],
  );

  useEffect(() => {
    biometrics()
    if (!selectedAccount) {
      return;
    }
    fetchAndUpdateBalance(selectedAccount);
  }, [fetchAndUpdateBalance, selectedAccount]);
const biometrics=async()=>{
 loginWithBiometrics("1232")
}
  return (
    <>
      <View style={styles.mainContainer}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {selectedAccount ? (
            <>
              <Section title="Sign a transaction">
                <SignTransactionButton />
              </Section>

              <Section title="Sign a message">
                <SignMessageButton />
              </Section>
            </>
          ) : null}
        </ScrollView>
        {selectedAccount ? (
          <AccountInfo
            selectedAccount={selectedAccount}
            balance={balance}
            fetchAndUpdateBalance={fetchAndUpdateBalance}
          />
        ) : (
          <ConnectButton title="Connect wallet" />
        )}
        <Text>Selected cluster: {connection.rpcEndpoint}</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    height: '100%',
    padding: 16,
    flex: 1,
  },
  scrollContainer: {
    height: '100%',
  },
  buttonGroup: {
    flexDirection: 'column',
    paddingVertical: 4,
  },
});
