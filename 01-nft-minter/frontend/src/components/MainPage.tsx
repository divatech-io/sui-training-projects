import { useCurrentAccount } from "@mysten/dapp-kit";
import { ConnectButton } from "./ConnectButton";
import { MintNftButton } from "./MintNftButton";
import { NftList } from "./NftList";
import { ThemeToggle } from "./ui/theme-toggle";

export function MainPage() {
  const currentAccount = useCurrentAccount();

  return (
    <div className="@container">
      <div className="mx-auto @3xl:w-[48rem] @3xl:px-0 p-4 space-y-8 relative">
        <div className="flex flex-wrap gap-2">
          <ConnectButton />
          {currentAccount && <MintNftButton />}
          <ThemeToggle />
        </div>

        <div className="space-y-2">
          <div className="text-2xl font-semibold">My NFTs</div>
          {currentAccount ? (
            <NftList account={currentAccount} />
          ) : (
            <div>Please connect wallet to see your NFTs 💸</div>
          )}
        </div>
      </div>
    </div>
  );
}
