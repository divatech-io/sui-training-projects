module tip_jar::tip_jar;

use sui::coin::{Self, Coin};
use sui::sui::SUI;

#[test_only]
use sui::test_scenario as ts;

public struct TipJar has key {
    id: UID,
    total: u64,
    owner: address,
}

fun init(ctx: &mut TxContext) {
    let tip_jar = TipJar {id: object::new(ctx), total: 0, owner: ctx.sender()};
    transfer::share_object(tip_jar);
}

public entry fun receive_sui(tip_jar: &mut TipJar, coin: Coin<SUI>) {
    let amount = coin::value<SUI>(&coin);
    tip_jar.total = tip_jar.total + amount;
    transfer::public_transfer(coin, tip_jar.owner);
}

public fun total(tip_jar: &TipJar): u64 {
    tip_jar.total
}

#[test_only]
public fun init_for_test(ctx: &mut TxContext) {
    init(ctx);
}

#[test]
fun receive_tips() {
    let owner = @0xABB1;
    let tipper = @0xABB2;
    let tip_amount = 10000;

    let mut scenario = ts::begin(owner);

    {
        init_for_test(ts::ctx(&mut scenario));
    };

    ts::next_tx(&mut scenario, tipper);
    {
        let tip_coin = coin::mint_for_testing<SUI>(tip_amount, ts::ctx(&mut scenario));

        let mut tip_jar = ts::take_shared<TipJar>(&scenario);
        assert!(tip_jar.total == 0, 0);

        receive_sui(&mut tip_jar, tip_coin);

        assert!(tip_jar.total == tip_amount, 1);

        ts::return_shared(tip_jar);
    };

    ts::next_tx(&mut scenario, owner);
    {
        let received_coin = ts::take_from_sender<Coin<SUI>>(&scenario);
        assert!(coin::value(&received_coin) == tip_amount);

        coin::burn_for_testing(received_coin);
    };


    ts::end(scenario);
}