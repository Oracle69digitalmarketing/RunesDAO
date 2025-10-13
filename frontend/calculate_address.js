const { hash, CallData } = require('starknet');

const publicKey = '0x52c4c7fe6fdd58d17d68f8a6d2542dfcf0c662a59ed2c421d82cfcad7f2ebc0';
const classHash = '0x5b4b537eaa2399e3aa99c4e2e0208ebd6c71bc1467938cd52c798c601e43564';
const salt = '0x61cd73ab9a7d4f97ee3e2f9022efd245b1051bea41057756c6186aa4f9c4509';

const constructorCalldata = CallData.compile({ publicKey });

const address = hash.calculateContractAddressFromHash(
    salt,
    classHash,
    constructorCalldata,
    0
);

console.log(address);
