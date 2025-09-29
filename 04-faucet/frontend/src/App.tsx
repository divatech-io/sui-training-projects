import { SuiClientProvider, WalletProvider } from "@mysten/dapp-kit";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./config/tanstack-query";
import { networkConfig } from "./config/network";
import { ConnectButton } from "./components/ConnectButton";
import { EstimatedBalance } from "./components/EstimatedBalance";
import { ThemeProvider } from "./components/ui/theme-provider";
import { GetTokensButton } from "./components/GetTokensButton";
import { ThemeToggle } from "./components/ui/theme-toggle";

export function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <QueryClientProvider client={queryClient}>
        <SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
          <WalletProvider autoConnect>
            <div className="@container">
              <div className="mx-auto @3xl:w-[48rem] @3xl:px-0 p-4 gap-y-8 relative flex flex-col items-center">
                <div className="flex flex-wrap gap-2">
                  <ConnectButton />
                  <GetTokensButton />
                  <ThemeToggle />
                </div>

                <div className="flex flex-col items-center gap-1">
                  <div className="text-sm">Estimated balance</div>
                  <EstimatedBalance />
                </div>
              </div>
            </div>
          </WalletProvider>
        </SuiClientProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
