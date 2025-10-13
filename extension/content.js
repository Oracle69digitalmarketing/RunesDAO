import { generateProof } from "./src/zk-proof-handler.js";

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "generateProof") {
    generateProof()
      .then((proofData) => {
        chrome.runtime.sendMessage(proofData);
        sendResponse({ success: true });
      })
      .catch((error) => {
        console.error("Error generating proof:", error);
        sendResponse({ success: false });
      });
    // Return true to indicate that the response will be sent asynchronously.
    return true;
  }
});
