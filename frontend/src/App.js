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
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const abstraxion_react_native_1 = require("@burnt-labs/abstraxion-react-native");
const Subscriptions_1 = require("./Subscriptions");
const contractAddress = "0x0..."; // Placeholder
const simplifiedAbi = [
    {
        "type": "function",
        "name": "register_member",
        "inputs": [
            { "name": "bitcoin_address", "type": "felt252" },
            { "name": "runes_balance", "type": "u256" },
            { "name": "signature", "type": "felt252" }
        ],
        "outputs": [],
        "state_mutability": "external"
    },
    {
        "type": "function",
        "name": "vote",
        "inputs": [
            { "name": "proposal_id", "type": "u256" },
            { "name": "support", "type": "bool" },
            { "name": "bitcoin_address", "type": "felt252" },
            { "name": "signature", "type": "felt252" }
        ],
        "outputs": [],
        "state_mutability": "external"
    }
];
function App() {
    const { abstraxionAccount, isConnected, login, logout } = (0, abstraxion_react_native_1.useAbstraxion)();
    const [proposalId, setProposalId] = (0, react_1.useState)("");
    const handleRegisterMember = () => __awaiter(this, void 0, void 0, function* () {
        if (abstraxionAccount) {
            console.log("Registering member...");
        }
    });
    const handleVote = (support) => {
        if (abstraxionAccount && proposalId) {
            console.log(`Voting on proposal ${proposalId}`);
        }
    };
    return (<react_native_1.SafeAreaView style={styles.container}>
      <react_native_1.Text style={styles.title}>RunesDAO+</react_native_1.Text>
      <react_native_1.View style={styles.buttonContainer}>
        {isConnected ? (<react_native_1.Button title="Logout" onPress={logout}/>) : (<react_native_1.Button title="Connect with XION" onPress={() => login()}/>)}
      </react_native_1.View>

      {isConnected && abstraxionAccount ? (<react_native_1.View>
          <react_native_1.Text>Starknet Account: {abstraxionAccount.address}</react_native_1.Text>
          <react_native_1.Button title="Register as Member" onPress={handleRegisterMember}/>

          <react_native_1.View style={styles.voteContainer}>
            <react_native_1.TextInput style={styles.input} placeholder="Proposal ID" onChangeText={setProposalId} value={proposalId}/>
            <react_native_1.Button title="Vote For" onPress={() => handleVote(true)}/>
            <react_native_1.Button title="Vote Against" onPress={() => handleVote(false)}/>
          </react_native_1.View>
          <Subscriptions_1.Subscriptions abstraxionAccount={abstraxionAccount}/>
        </react_native_1.View>) : (<react_native_1.Text>Connect your wallet to get started.</react_native_1.Text>)}
    </react_native_1.SafeAreaView>);
}
const styles = react_native_1.StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        marginBottom: 20,
    },
    buttonContainer: {
        marginBottom: 20,
    },
    infoContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    voteContainer: {
        marginTop: 20,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
    }
});
exports.default = () => (<abstraxion_react_native_1.XionProvider>
    <App />
  </abstraxion_react_native_1.XionProvider>);
