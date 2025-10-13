"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Subscriptions = void 0;
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const sdk_1 = require("@reclaim/sdk");
const starknet_1 = require("starknet");
const subscriptionContractAddress = "0x1..."; // Placeholder
const subscriptionAbi = [
    {
        "type": "function",
        "name": "authorize_payment",
        "inputs": [
            { "name": "zk_proof", "type": "felt252" },
            { "name": "plan_id", "type": "felt252" }
        ],
        "outputs": [],
        "state_mutability": "external"
    }
];
function Subscriptions({ abstraxionAccount }) {
    const [planId, setPlanId] = (0, react_1.useState)("");
    const [isSubscribing, setIsSubscribing] = (0, react_1.useState)(false);
    const handleSubscribe = () => __awaiter(this, void 0, void 0, function* () {
        if (!abstraxionAccount || !planId) {
            return;
        }
        setIsSubscribing(true);
        try {
            const reclaim = new sdk_1.Reclaim();
            const requestedProofs = [reclaim.requestProofs({
                    title: "GitHub Account",
                    baseCallbackUrl: "https://runesdao.xyz/callback",
                    provider: 'github-contributor',
                    context: 'RunesDAO Subscription'
                })];
            const proofRequestUrl = yield reclaim.getReclaimUrl(requestedProofs);
            console.log("Open this URL to generate a proof:", proofRequestUrl);
            // **SIMULATION:** In a real app, you'd get this from your backend after the user provides the proof.
            const simulatedProof = "mock_zk_proof_from_reclaim";
            const contract = new starknet_1.Contract(subscriptionAbi, subscriptionContractAddress, abstraxionAccount);
            yield contract.authorize_payment(simulatedProof, planId);
            alert('Subscription successful!');
        }
        catch (error) {
            console.error("Subscription failed:", error);
            alert('Subscription failed. See console for details.');
        }
        finally {
            setIsSubscribing(false);
        }
    });
    return (<react_native_1.View style={styles.container}>
      <react_native_1.Text style={styles.title}>Private Subscriptions</react_native_1.Text>
      <react_native_1.TextInput style={styles.input} placeholder="Plan ID" onChangeText={setPlanId} value={planId}/>
      <react_native_1.Button title={isSubscribing ? "Subscribing..." : "Subscribe with Reclaim"} onPress={handleSubscribe} disabled={!abstraxionAccount || isSubscribing}/>
    </react_native_1.View>);
}
exports.Subscriptions = Subscriptions;
const styles = react_native_1.StyleSheet.create({
    container: {
        marginTop: 40,
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 10,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
        width: 200,
    },
});
