import { ConnectButton } from "@/components/ConnectButton";
import { LeaveTipButton } from "@/components/LeaveTipButton";
import { TotalAmount } from "@/components/TotalAmount";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useCurrentAccount } from "@mysten/dapp-kit";

export function MainPage() {
  const currentAccount = useCurrentAccount();

  return (
    <div className="@container">
      <div className="mx-auto @3xl:w-[48rem] @3xl:px-0 p-4 gap-y-8 relative flex flex-col items-center">
        <div className="flex flex-wrap gap-2">
          <ConnectButton />
          {currentAccount && <LeaveTipButton />}
          <ThemeToggle />
        </div>

        <div className="flex flex-col items-center gap-1">
          <div className="text-sm">Total amount</div>
          <TotalAmount />
        </div>
      </div>
    </div>
  );
}
