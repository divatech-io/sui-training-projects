import { useOwnedNftsQuery } from "@/hooks/useOwnedNftsQuery";
import type { Nft } from "@/types";
import type { WalletAccount } from "@mysten/wallet-standard";
import { LoaderCircleIcon } from "lucide-react";

type NftListProps = {
  account: WalletAccount;
};

export function NftList({ account }: NftListProps) {
  const ownedNftsQuery = useOwnedNftsQuery({ owner: account.address });

  if (ownedNftsQuery.isPending)
    return <LoaderCircleIcon className="animate-spin" />;

  if (ownedNftsQuery.isError) return <div>Smth. went wrong ⛔</div>;

  const nfts = ownedNftsQuery.data.data;
  if (!nfts.length) return <div>You haven't minted any NFTs yet 😔</div>;

  return (
    <div className="w-full gap-2 grid grid-cols-2 sm:grid-cols-4">
      {nfts.map((nft, index) => (
        <NftListItem key={index} src={nft} />
      ))}
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
