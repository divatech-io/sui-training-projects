module nft::nft;

use sui::url::{Self, Url};
use std::string;

#[test_only]
use sui::test_scenario as ts;

public struct NFT has key {
    id: UID,
    name: string::String,
    metadata_url: Url,
}

public entry fun mint (name: vector<u8>, url: vector<u8>, ctx: &mut TxContext) {
    let nft = NFT {
        id: object::new(ctx),
        name: string::utf8(name),
        metadata_url: url::new_unsafe_from_bytes(url)
    };

    transfer::transfer(nft, ctx.sender());
}

public fun name(nft: &NFT): &string::String {
    &nft.name
}

public fun url(nft: &NFT): &Url {
    &nft.metadata_url
}

#[test]
fun mint_nft() {
    let addr = @0xA;

    let mut scenario = ts::begin(addr);
    {
        mint(b"Test name", b"https://www.google.com", ts::ctx(&mut scenario));
    };

    ts::next_tx(&mut scenario, addr);
    {
        let nft = ts::take_from_sender<NFT>(&scenario);
        assert!(nft.name == string::utf8(b"Test name"));
        ts::return_to_sender(&scenario, nft);
    };

    ts::end(scenario);

}

