/**
 * @fileoverview Handles the generation of ZK proofs using the Wootzapp API.
 */

/**
 * Generates a ZK proof for the current page's content.
 * @returns {Promise<{proof: string, verification_key: string, public_inputs: any[]}>}
 *   A promise that resolves with the proof, verification key, and public inputs.
 */
export function generateProof() {
  return new Promise((resolve, reject) => {
    if (!chrome.wootz || !chrome.wootz.generateZKProof) {
      return reject(new Error("Wootzapp API not found."));
    }

    chrome.wootz.generateZKProof(
      window.location.href,
      document.body.innerHTML,
      (result) => {
        if (chrome.runtime.lastError) {
          return reject(chrome.runtime.lastError);
        }
        const { proof, verification_key, public_inputs } = result;
        resolve({ proof, verification_key, public_inputs });
      }
    );
  });
}
