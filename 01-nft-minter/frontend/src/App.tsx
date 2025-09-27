import { SuiClientProvider, WalletProvider } from "@mysten/dapp-kit";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./config/tanstack-query";
import { networkConfig } from "./config/network";
import { ConnectButton } from "./components/ConnectButton";
import { MintNftButton } from "./components/MintNftButton";
import { NftList } from "./components/NftList";

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networkConfig} defaultNetwork="localnet">
        <WalletProvider autoConnect>
          <div className="@container">
            <div className="mx-auto @3xl:w-[48rem] @4xl:px-0 px-4 relative">
              <div className="p-4 space-y-8">
                <div className="flex flex-wrap gap-2">
                  <ConnectButton />
                  <MintNftButton />
                </div>

                <div className="space-y-2">
                  <div className="text-2xl font-semibold">My NFTs</div>
                  <NftList />
                </div>
              </div>
            </div>
          </div>
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
}
