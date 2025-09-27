import { SuiClientProvider, WalletProvider } from "@mysten/dapp-kit";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./config/tanstack-query";
import { networkConfig } from "./config/network";
import { ConnectButton } from "./components/ConnectButton";
import { MintNftButton } from "./components/MintNftButton";

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networkConfig} defaultNetwork="localnet">
        <WalletProvider autoConnect>
          <div className="p-4">
            <div className="flex flex-wrap gap-2">
              <ConnectButton />
              <MintNftButton />
            </div>
          </div>
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
}
