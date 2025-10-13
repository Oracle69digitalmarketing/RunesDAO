import { verifyProof } from "./src/verify.js";

chrome.runtime.onMessage.addListener(async (message) => {
  if (message.proof) {
    const isValid = await verifyProof(message);
    console.log("Proof is valid:", isValid);
    // Here you could send a message back to the popup or content script
    // to inform them of the verification result.
  }
});
