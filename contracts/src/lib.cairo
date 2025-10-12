#[starknet::contract]
mod RunesDAO {
    use starknet::ContractAddress;

    #[derive(Drop, starknet::Store)]
    struct Proposal {
        for_votes: u256,
        against_votes: u256,
    }

    #[storage]
    struct Storage {
        members: LegacyMap<felt252, u256>,
        proposals: LegacyMap<u256, Proposal>,
        votes: LegacyMap<(u256, felt252), bool>,
        next_proposal_id: u256,
    }

    #[starknet::interface]
    trait IRunesDAO<TState> {
        fn register_member(ref self: TState, bitcoin_address: felt252, runes_balance: u256, signature: felt252);
        fn vote(ref self: TState, proposal_id: u256, support: bool, signature: felt252);
        fn create_proposal(ref self: TState);
    }

    #[abi(embed_v0)]
    impl RunesDAOImpl of IRunesDAO<ContractState> {
        fn register_member(ref self: ContractState, bitcoin_address: felt252, runes_balance: u256, signature: felt252) {
            // TODO: Validate signature
            self.members.write(bitcoin_address, runes_balance);
        }

        fn vote(ref self: ContractState, proposal_id: u256, support: bool, signature: felt252) {
            // TODO: Validate signature
            let voter_address = starknet::get_caller_address();
            // TODO: this should be the bitcoin address, not the starknet address
            // self.votes.write((proposal_id, voter_address), support);
        }

        fn create_proposal(ref self: TState) {
            let proposal_id = self.next_proposal_id.read();
            self.proposals.write(proposal_id, Proposal { for_votes: 0, against_votes: 0 });
            self.next_proposal_id.write(proposal_id + 1);
        }
    }
}
