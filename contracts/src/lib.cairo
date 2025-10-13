mod dummy_verifier;

#[starknet::interface]
trait IReclaimVerifier<TState> {
    fn verify_proof(self: @TState, proof: felt252, public_inputs: felt252) -> bool;
}

#[starknet::contract]
mod RunesDAO {
    use starknet::ContractAddress;
    use starknet::storage::Map;
    use super::{IReclaimVerifierDispatcher, IReclaimVerifierDispatcherTrait};

    #[derive(Drop, starknet::Store)]
    struct Proposal {
        for_votes: u256,
        against_votes: u256,
        executed: bool,
        end_time: u64,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        TreasuryTransfer: TreasuryTransfer,
    }

    #[derive(Drop, starknet::Event)]
    struct TreasuryTransfer {
        proposal_id: u256,
        recipient: ContractAddress,
        amount: u256,
        asset: ContractAddress,
    }

    #[storage]
    struct Storage {
        members: Map<felt252, u256>,
        proposals: Map<u256, Proposal>,
        votes: Map<(u256, felt252), bool>,
        next_proposal_id: u256,
        reclaim_verifier_address: ContractAddress,
    }

    #[constructor]
    fn constructor(ref self: ContractState, reclaim_verifier_address: ContractAddress) {
        self.reclaim_verifier_address.write(reclaim_verifier_address);
    }

    #[starknet::interface]
    trait IToken<TState> {
        fn transfer(ref self: TState, recipient: ContractAddress, amount: u256);
    }

    #[starknet::interface]
    trait IRunesDAO<TState> {
        fn register_member(ref self: TState, bitcoin_address: felt252, runes_balance: u256, signature: felt252);
        fn vote(ref self: TState, proposal_id: u256, support: bool, bitcoin_address: felt252, signature: felt252);
        fn create_proposal(ref self: TState, end_time: u64);
        fn execute_treasury_proposal(ref self: TState, proposal_id: u256, recipient: ContractAddress, amount: u256, asset: ContractAddress);
    }

    #[abi(embed_v0)]
    impl RunesDAOImpl of IRunesDAO<ContractState> {
        fn register_member(ref self: ContractState, bitcoin_address: felt252, runes_balance: u256, signature: felt252) {
            let verifier = IReclaimVerifierDispatcher { contract_address: self.reclaim_verifier_address.read() };
            assert(verifier.verify_proof(signature, bitcoin_address), 'Invalid signature');
            self.members.write(bitcoin_address, runes_balance);
        }

        fn vote(ref self: ContractState, proposal_id: u256, support: bool, bitcoin_address: felt252, signature: felt252) {
            let verifier = IReclaimVerifierDispatcher { contract_address: self.reclaim_verifier_address.read() };
            assert(verifier.verify_proof(signature, bitcoin_address), 'Invalid signature');
            self.votes.write((proposal_id, bitcoin_address), support);
        }

        fn create_proposal(ref self: ContractState, end_time: u64) {
            let proposal_id = self.next_proposal_id.read();
            self.proposals.write(proposal_id, Proposal { for_votes: 0, against_votes: 0, executed: false, end_time });
            self.next_proposal_id.write(proposal_id + 1);
        }

        fn execute_treasury_proposal(ref self: ContractState, proposal_id: u256, recipient: ContractAddress, amount: u256, asset: ContractAddress) {
            let mut proposal = self.proposals.read(proposal_id);
            assert(proposal.for_votes > proposal.against_votes, 'Proposal failed');
            assert(!proposal.executed, 'Proposal already executed');
            assert(starknet::get_block_timestamp() > proposal.end_time, 'Voting still in progress');

            let token = ITokenDispatcher { contract_address: asset };
            token.transfer(recipient, amount);

            proposal.executed = true;
            self.proposals.write(proposal_id, proposal);

            self.emit(Event::TreasuryTransfer(TreasuryTransfer { proposal_id, recipient, amount, asset }));
        }
    }
}

#[starknet::contract]
mod Subscriptions {
    use starknet::ContractAddress;
    use starknet::storage::Map;
    use super::{IReclaimVerifierDispatcher, IReclaimVerifierDispatcherTrait};

    #[storage]
    struct Storage {
        authorized_payments: Map<(felt252, felt252), bool>,
        reclaim_verifier_address: ContractAddress,
    }

    #[constructor]
    fn constructor(ref self: ContractState, reclaim_verifier_address: ContractAddress) {
        self.reclaim_verifier_address.write(reclaim_verifier_address);
    }

    #[starknet::interface]
    trait ISubscriptions<TState> {
        fn authorize_payment(ref self: TState, zk_proof: felt252, plan_id: felt252);
    }

    #[abi(embed_v0)]
    impl SubscriptionsImpl of ISubscriptions<ContractState> {
         fn authorize_payment(ref self: ContractState, zk_proof: felt252, plan_id: felt252) {
            let verifier = IReclaimVerifierDispatcher { contract_address: self.reclaim_verifier_address.read() };
            assert(verifier.verify_proof(zk_proof, plan_id), 'Invalid ZK proof');
            let user_id = starknet::get_caller_address();
            self.authorized_payments.write((user_id.into(), plan_id), true);
        }
    }
}