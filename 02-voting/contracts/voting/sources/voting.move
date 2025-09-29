module voting::voting;

use sui::dynamic_field as df;
use std::string;

#[test_only]
use sui::test_scenario as ts;

public struct Proposal has key {
    id: UID,
    yes: u64,
    no: u64,
    statement: string::String,
}

public entry fun create_proposal (statement: vector<u8>, ctx: &mut TxContext) {
    let proposal = Proposal {
        id: object::new(ctx),
        yes: 0,
        no: 0,
        statement: string::utf8(statement),
    };

    transfer::share_object(proposal);
}

public entry fun vote (proposal: &mut Proposal, yes: bool, ctx: &mut TxContext) {
    assert!(!df::exists_(&proposal.id, ctx.sender()));
    if (yes) {
        proposal.yes = proposal.yes + 1
    } else {
        proposal.no = proposal.no + 1;
    };
    df::add(&mut proposal.id, ctx.sender(), yes);
}

#[test]
fun test_voting() {
    let addr1 = @0xA;
    let addr2 = @0xB;

    let mut scenario = ts::begin(addr1);
    {
        create_proposal(b"Do you agree?", ts::ctx(&mut scenario));
    };

    ts::next_tx(&mut scenario, addr1);
    {
        let mut proposal = ts::take_shared<Proposal>(&scenario);
        assert!(proposal.yes == 0);
        assert!(proposal.no == 0);
        assert!(proposal.statement == string::utf8(b"Do you agree?"));

        vote(&mut proposal, true, ts::ctx(&mut scenario));

        assert!(proposal.yes == 1);
        assert!(proposal.no == 0);

        ts::return_shared(proposal);

    };

    ts::next_tx(&mut scenario, addr2);
    {
        let mut proposal = ts::take_shared<Proposal>(&scenario);
        assert!(proposal.yes == 1);
        assert!(proposal.no == 0);
        assert!(proposal.statement == string::utf8(b"Do you agree?"));

        vote(&mut proposal, false, ts::ctx(&mut scenario));

        assert!(proposal.yes == 1);
        assert!(proposal.no == 1);
        
        ts::return_shared(proposal);

    };

    ts::end(scenario);
}


#[test, expected_failure]
fun test_voting_failure() {
    let addr1 = @0xA;

    let mut scenario = ts::begin(addr1);
    {
        create_proposal(b"Do you agree?", ts::ctx(&mut scenario));
    };

    ts::next_tx(&mut scenario, addr1);
    {
        let mut proposal = ts::take_shared<Proposal>(&scenario);
        assert!(proposal.yes == 0);
        assert!(proposal.no == 0);
        assert!(proposal.statement == string::utf8(b"Do you agree?"));

        vote(&mut proposal, true, ts::ctx(&mut scenario));
        vote(&mut proposal, true, ts::ctx(&mut scenario));

        assert!(proposal.yes == 1);
        assert!(proposal.no == 0);

        ts::return_shared(proposal);

    };

    ts::end(scenario);
}