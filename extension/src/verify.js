import { Account, Provider, Contract } from "starknet";

/**
 * Verifies a ZK proof with the RunesDAO+ contract on StarkNet.
 * @param {{proof: string, verification_key: string, public_inputs: any[]}} proofData
 *   The proof data to verify.
 * @returns {Promise<boolean>} A promise that resolves with true if the proof is valid,
 *   and false otherwise.
 */
export async function verifyProof(proofData) {
  const provider = new Provider({ sequencer: { network: "testnet" } });

  // These values need to be replaced with the actual contract address and ABI
  const contractAddress = process.env.STARKNET_DAO_ADDRESS;
  const contractAbi = process.env.STARKNET_DAO_ABI;

  if (!contractAddress || !contractAbi) {
    console.error(
      "STARKNET_DAO_ADDRESS and STARKNET_DAO_ABI must be set."
    );
    return false;
  }

  const daoContract = new Contract(contractAbi, contractAddress, provider);

  try {
    const result = await daoContract.call("verify_proof", proofData);
    console.log("Proof verification result:", result);
    // The contract should return a boolean or a value that can be interpreted as such.
    // Adjust this based on the actual contract's return value.
    return !!result;
  } catch (error) {
    console.error("Error verifying proof:", error);
    return false;
  }
}
