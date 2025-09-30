import { useOwnedNftsQuery } from "@/hooks/useOwnedNftsQuery";
import type { Nft } from "@/types";
import { LoaderCircleIcon } from "lucide-react";
import { Button } from "./ui/button";
import React from "react";
import { useCurrentAccount } from "@mysten/dapp-kit";

export function NftList() {
  const currentAccount = useCurrentAccount();
  const ownedNftsQuery = useOwnedNftsQuery({
    ownerAddress: currentAccount?.address,
  });

  if (!currentAccount)
    return <div>Please connect wallet to see your NFTs 💸</div>;

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
        disabled={!ownedNftsQuery.hasNextPage || ownedNftsQuery.isFetching}
        onClick={() => ownedNftsQuery.fetchNextPage()}
      >
        Load more
        {ownedNftsQuery.isFetchingNextPage && (
          <LoaderCircleIcon className="animate-spin" />
        )}
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
