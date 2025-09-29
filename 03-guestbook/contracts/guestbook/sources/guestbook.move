module guestbook::guestbook;

use sui::dynamic_field as df;
use std::string;
use sui::event;

#[test_only]
use sui::test_scenario as ts;

public struct GuestBook has key {
    id: UID,
    cnt: u64,
}

public struct NewMessage has copy, drop {
    guestbook_id: ID,
    author: address,
    index: u64,
    message: string::String,
}

fun init (ctx: &mut TxContext) {
    let guestbook = GuestBook {id: object::new(ctx), cnt: 0};
    transfer::share_object(guestbook);
}

public entry fun leave_message (guestbook: &mut GuestBook, message: string::String, ctx: &TxContext) {
    assert!(message.length() < 100);

    event::emit(NewMessage {
        guestbook_id: object::id(guestbook),
        author: ctx.sender(),
        index: guestbook.cnt,
        message: copy message,
    });

    df::add(&mut guestbook.id, guestbook.cnt, message);
    guestbook.cnt = guestbook.cnt + 1;
}

public fun message(guestbook: &GuestBook, index: u64): &string::String {
    assert!(index < guestbook.cnt, 1);
    df::borrow<u64, string::String>(&guestbook.id, index)
}

#[test_only]
public fun init_for_test(ctx: &mut TxContext) {
    init(ctx);
}

#[test]
fun test_leave_message() {
    let addr1 = @0xAB;

    let mut scenario = ts::begin(addr1);
    {
        init_for_test(ts::ctx(&mut scenario));
    };

    ts::next_tx(&mut scenario, addr1);
    {
        let mut guestbook = ts::take_shared<GuestBook>(&scenario);
        assert!(guestbook.cnt == 0);

        leave_message(&mut guestbook, string::utf8(b"first message"), ts::ctx(&mut scenario));

        assert!(guestbook.cnt == 1);

        let msg = guestbook.message(0);
        assert!(msg == string::utf8(b"first message"));

        ts::return_shared(guestbook);
    };

    ts::end(scenario);
}

