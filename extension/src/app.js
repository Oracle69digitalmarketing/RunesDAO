/**
 * @fileoverview This script is for the extension's popup UI.
 * It provides a button to trigger the proof generation and displays the result.
 */

document.addEventListener("DOMContentLoaded", () => {
  const generateProofButton = document.getElementById("generateProof");
  const statusDiv = document.getElementById("status");

  generateProofButton.addEventListener("click", () => {
    statusDiv.textContent = "Generating proof...";
    // Send a message to the content script to trigger the proof generation.
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: "generateProof" }, (response) => {
        if (chrome.runtime.lastError) {
          statusDiv.textContent = `Error: ${chrome.runtime.lastError.message}`;
          return;
        }
        if (response && response.success) {
          statusDiv.textContent = "Proof generated and sent for verification.";
        } else {
          statusDiv.textContent = "Proof generation failed.";
        }
      });
    });
  });
});
