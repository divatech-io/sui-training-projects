import { useOwnedNftsQuery } from "@/hooks/useOwnedNftsQuery";
import type { Nft } from "@/types";
import type { WalletAccount } from "@mysten/wallet-standard";
import { LoaderCircleIcon } from "lucide-react";
import { Button } from "./ui/button";
import React from "react";

type NftListProps = {
  account: WalletAccount;
};

export function NftList({ account }: NftListProps) {
  const ownedNftsQuery = useOwnedNftsQuery({ owner: account.address });

  if (ownedNftsQuery.isPending)
    return <LoaderCircleIcon className="animate-spin" />;

  if (ownedNftsQuery.isError) return <div>Smth. went wrong ⛔</div>;

  if (!ownedNftsQuery.data.pages[0]?.data.length)
    return <div>You haven't minted any NFTs yet 😔</div>;

  return (
    <div className="flex flex-col gap-4 items-start">
      <div className="w-full gap-2 grid grid-cols-2 sm:grid-cols-4">
        {ownedNftsQuery.data.pages.map((page, index) => (
          <React.Fragment key={index}>
            {page.data.map((nft, index) => (
              <NftListItem key={index} src={nft} />
            ))}
          </React.Fragment>
        ))}
      </div>
      <Button
        disabled={!ownedNftsQuery.hasNextPage}
        onClick={() => ownedNftsQuery.fetchNextPage()}
      >
        Load more
      </Button>
    </div>
  );
}

type NftListItemProps = {
  src: Nft;
};

function NftListItem({ src }: NftListItemProps) {
  return (
    <div className="rounded-md flex flex-col overflow-hidden border w-full">
      <img src={src.photoUrl} className="w-full object-cover aspect-square" />
      <div className="px-3 py-2 wrap-normal">{src.name}</div>
    </div>
  );
}
