# RunesDAO+ Deployment Guide

This guide provides step-by-step instructions for deploying the RunesDAO+ backend (Starknet contracts) and frontend (React Native application) for a production environment.

## 1. Prerequisites

Before you begin, ensure you have the following installed and configured:

*   **Node.js and npm:** [https://nodejs.org/](https://nodejs.org/)
*   **React Native CLI:** [https://reactnative.dev/docs/environment-setup](https://reactnative.dev/docs/environment-setup)
*   **Scarb:** [https://docs.swmansion.com/scarb/](https://docs.swmansion.com/scarb/)
*   **Starkli:** [https://book.starkli.rs/](https://book.starkli.rs/)
*   **Xverse Wallet:** For interacting with Bitcoin Runes.
*   **AVNU API Key:** For sponsoring gas fees.

## 2. Backend Deployment (Starknet Contracts)

The backend consists of Cairo smart contracts that are deployed to the Starknet network. The `scripts/deploy.sh` script is provided to automate this process.

### 2.1. Configure Starknet Account

The deployment script requires a Starknet account JSON file and a keystore.

1.  **Account File:** The script expects the account file at `/home/sophiemabel69/RunesDAO/runesdao_account.json`. Ensure your Starknet account file is placed there.
2.  **Keystore File:** The script expects the keystore file at `/home/sophiemabel69/.starkli/keystore.json`.

### 2.2. Secure Your Keystore Password

**Security Warning:** The `deploy.sh` script hardcodes the keystore password. This is a major security risk. It is strongly recommended to remove the password from the script and enter it manually when prompted.

**Recommended Change:**

Open `scripts/deploy.sh` and remove the following line:

```bash
export STARKNET_KEYSTORE_PASSWORD='@Cherry4luv#'
```

### 2.3. Run the Deployment Script

The deployment script deploys the contracts in the following order: `DummyVerifier`, `RunesDAO`, and `Subscriptions`.

The deployment is a two-step process for each contract: `declare` and `deploy`.

1.  **Declare DummyVerifier:**
    ```bash
    sncast --keystore /home/sophiemabel69/.starkli/keystore.json --account /home/sophiemabel69/RunesDAO/runesdao_account.json declare --network=sepolia --contract-name=DummyVerifier --package=runesdao_contracts
    ```
    This will output a **class hash**.

2.  **Deploy DummyVerifier:**
    Replace `<DUMMY_VERIFIER_CLASS_HASH>` in the script with the class hash from the previous step.
    ```bash
    sncast --keystore /home/sophiemabel69/.starkli/keystore.json --account /home/sophiemabel69/RunesDAO/runesdao_account.json deploy --network=sepolia --class-hash=<DUMMY_VERIFIER_CLASS_HASH>
    ```
    This will output the **address** of the `DummyVerifier` contract.

3.  **Declare and Deploy RunesDAO and Subscriptions:**
    Repeat the `declare` and `deploy` steps for the `RunesDAO` and `Subscriptions` contracts, as outlined in the `deploy.sh` script.

    *   For the `deploy` step of `RunesDAO` and `Subscriptions`, you will need to provide the address of the `DummyVerifier` contract as a constructor argument. Replace `<DUMMY_VERIFIER_ADDRESS>` with the address you obtained in step 2.

## 3. Frontend Deployment (React Native App)

The frontend is a React Native application.

### 3.1. Configure Environment Variables

1.  Create a `.env` file in the `frontend` directory by copying the `.env.example` file:
    ```bash
    cp frontend/.env.example frontend/.env
    ```
2.  Open `frontend/.env` and add your AVNU API key:
    ```
    AVNU_API_KEY=your_avnu_api_key
    ```

### 3.2. Build the Application for Production

To deploy the application to production, you need to generate a signed APK (for Android) or IPA (for iOS).

**For Android:**

1.  Follow the official React Native guide for generating a signed APK: [https://reactnative.dev/docs/signed-apk-android](https://reactnative.dev/docs/signed-apk-android)
2.  The general steps are:
    *   Generate a signing key.
    *   Set up Gradle variables.
    *   Bundle the app and generate the APK.

**For iOS:**

1.  Follow the official React Native guide for publishing to the App Store: [https://reactnative.dev/docs/publishing-to-app-store](https://reactnative.dev/docs/publishing-to-app-store)
2.  The general steps are:
    *   Configure your app in App Store Connect.
    *   Configure your project in Xcode.
    *   Build and archive the app.
    *   Upload the app to App Store Connect for review.
