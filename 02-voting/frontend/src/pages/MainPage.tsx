import { ConnectButton } from "@/components/ConnectButton";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { CreateProposalButton } from "@/components/CreateProposalButton";
import { ProposalsList } from "@/components/ProposalsList";

export function MainPage() {
  return (
    <div className="@container">
      <div className="mx-auto @3xl:w-[48rem] @3xl:px-0 p-4 space-y-8 relative">
        <div className="flex flex-wrap gap-2">
          <ConnectButton />
          <CreateProposalButton />
          <ThemeToggle />
        </div>

        <div className="space-y-2">
          <div className="text-2xl font-semibold">Proposals</div>
          <ProposalsList />
        </div>
      </div>
    </div>
  );
}
