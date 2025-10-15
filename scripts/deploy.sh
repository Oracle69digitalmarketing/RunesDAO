#!/bin/bash


# This script is for deploying the contracts to the Starknet Sepolia testnet.

# 1. Declare DummyVerifier
sncast --keystore /home/sophiemabel69/.starkli/keystores/runesdao.json --account /home/sophiemabel69/RunesDAO/runesdao_account.json declare --network=sepolia --contract-name=DummyVerifier --package=runesdao_contracts

# 2. Deploy DummyVerifier
# You will get the address of the verifier contract.
# Replace <DUMMY_VERIFIER_CLASS_HASH> with the class hash from the previous step.
sncast --keystore /home/sophiemabel69/.starkli/keystores/runesdao.json --account /home/sophiemabel69/RunesDAO/runesdao_account.json deploy --network=sepolia --class-hash=<DUMMY_VERIFIER_CLASS_HASH>

# 3. Declare RunesDAO
# You will get a class hash after running this command.
sncast --keystore /home/sophiemabel69/.starkli/keystores/runesdao.json --account /home/sophiemabel69/RunesDAO/runesdao_account.json declare --network=sepolia --contract-name=RunesDAO --package=runesdao_contracts

# 4. Deploy RunesDAO
# Replace <RUNESDAO_CLASS_HASH> with the class hash from the previous step.
# Replace <DUMMY_VERIFIER_ADDRESS> with the address of the DummyVerifier contract.
sncast --keystore /home/sophiemabel69/.starkli/keystores/runesdao.json --account /home/sophiemabel69/RunesDAO/runesdao_account.json deploy --network=sepolia --class-hash=<RUNESDAO_CLASS_HASH> --constructor-calldata <DUMMY_VERIFIER_ADDRESS>

# 5. Declare Subscriptions
# You will get a class hash after running this command.
sncast --keystore /home/sophiemabel69/.starkli/keystores/runesdao.json --account /home/sophiemabel69/RunesDAO/runesdao_account.json declare --network=sepolia --contract-name=Subscriptions --package=runesdao_contracts

# 6. Deploy Subscriptions
# Replace <SUBSCRIPTIONS_CLASS_HASH> with the class hash from the previous step.
# Replace <DUMMY_VERIFIER_ADDRESS> with the address of the DummyVerifier contract.
sncast --keystore /home/sophiemabel69/.starkli/keystores/runesdao.json --account /home/sophiemabel69/RunesDAO/runesdao_account.json deploy --network=sepolia --class-hash=<SUBSCRIPTIONS_CLASS_HASH> --constructor-calldata <DUMMY_VERIFIER_ADDRESS>
