#[starknet::contract]
mod Subscriptions {
    #[storage]
    struct Storage {
        authorized_payments: LegacyMap<(felt252, felt252), bool>,
    }

    #[starknet::interface]
    trait ISubscriptions<TState> {
        fn authorize_payment(ref self: TState, zk_proof: felt252, plan_id: felt252);
    }

    #[abi(embed_v0)]
    impl SubscriptionsImpl of ISubscriptions<ContractState> {
        fn authorize_payment(ref self: ContractState, zk_proof: felt252, plan_id: felt252) {
            // TODO: Verify ZK proof
            let user_id = starknet::get_caller_address();
            // self.authorized_payments.write((user_id, plan_id), true);
        }
    }
}
