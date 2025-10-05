module tipjar::tipjar;

use sui::coin::{Self, Coin};
use sui::sui::SUI;
use sui::balance::{Self, Balance};

#[test_only]
use sui::test_scenario as ts;

public struct TipJar has key {
    id: UID,
    balance: Balance<SUI>,
}

public struct AdminCap has key {
    id: UID,
}

fun init(ctx: &mut TxContext) {
    let tip_jar = TipJar {
        id: object::new(ctx),
        balance: balance::zero<SUI>(),
    };

    transfer::transfer(AdminCap { id: object::new(ctx) }, tx_context::sender(ctx));
    transfer::share_object(tip_jar);
}

public entry fun donate(tip_jar: &mut TipJar, coin: Coin<SUI>) {
    let donation_balance = coin::into_balance(coin);
    balance::join(&mut tip_jar.balance, donation_balance);
}

public entry fun withdraw(_: &AdminCap, tip_jar: &mut TipJar, ctx: &mut TxContext) {
    assert!(balance::value(&tip_jar.balance) > 0);
    let all_balance = balance::withdraw_all(&mut tip_jar.balance);
    let coin = coin::from_balance(all_balance, ctx);

    transfer::public_transfer(coin, tx_context::sender(ctx));
}

public fun available_amount(tip_jar: &TipJar): u64 {
    balance::value(&tip_jar.balance)
}

#[test_only]
const ADMIN: address = @0xAB;
#[test_only]
const USER: address = @0xab;

#[test]
fun test_donate_and_withdraw() {
    let mut scenario = ts::begin(ADMIN);  
    {
    init(ts::ctx(&mut scenario));
    };

    ts::next_tx(&mut scenario, USER);
    {
        let mut tip_jar = ts::take_shared<TipJar>(&scenario);
        let coin = coin::mint_for_testing<SUI>(2000, ts::ctx(&mut scenario));
        donate(&mut tip_jar, coin);
        assert!(available_amount(&tip_jar) == 2000, 0);

        ts::return_shared(tip_jar);
    };

    ts::next_tx(&mut scenario, ADMIN);
    {
        let mut tip_jar = ts::take_shared<TipJar>(&scenario);
        let admin_cap = ts::take_from_sender<AdminCap>(&scenario);

        withdraw(&admin_cap, &mut tip_jar, ts::ctx(&mut scenario));
        assert!(available_amount(&tip_jar) == 0);

        ts::return_shared(tip_jar);
        ts::return_to_sender(&scenario, admin_cap);  
    };

    ts::next_tx(&mut scenario, ADMIN);
    {
        let sui_coins = ts::take_from_sender<Coin<SUI>>(&scenario);
        assert!(coin::value(&sui_coins) == 2000);
        ts::return_to_sender(&scenario, sui_coins);
    };

    ts::end(scenario);
}


