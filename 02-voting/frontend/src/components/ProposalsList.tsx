import { useProposalsQuery } from "@/hooks/useProposalsQuery";
import { CheckIcon, LoaderCircleIcon } from "lucide-react";
import { Button } from "./ui/button";
import type { Proposal } from "@/types";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useQueryClient } from "@tanstack/react-query";
import { useVoteQuery } from "@/hooks/useVoteQuery";
import { usePerformEnokiTransaction } from "@/hooks/usePerformEnokiTransaction";
import { useNetworkVariables } from "@/config/network";

export function ProposalsList() {
  const proposalsQuery = useProposalsQuery();

  if (proposalsQuery.isPending)
    return <LoaderCircleIcon className="animate-spin" />;

  if (proposalsQuery.isError) return <div>Smth. went wrong ⛔</div>;

  if (!proposalsQuery.data.length)
    return <div>Thare aren't any proposals yet 😔</div>;

  return (
    <div className="w-full gap-2 grid grid-cols-2 sm:grid-cols-4">
      {proposalsQuery.data.map((proposal) => (
        <ProposalListItem key={proposal.id} src={proposal} />
      ))}
    </div>
  );
}

type ProposalListItemProps = {
  src: Proposal;
};

function ProposalListItem({ src }: ProposalListItemProps) {
  const performTransactionMutation = usePerformEnokiTransaction();
  const queryClient = useQueryClient();
  const networkVariables = useNetworkVariables();
  const currentAccount = useCurrentAccount();

  const voteQuery = useVoteQuery({
    proposalId: src.id,
    voterAddress: currentAccount?.address,
  });

  function onClick(vote: "yes" | "no") {
    const tx = new Transaction();
    tx.moveCall({
      target: `${networkVariables.votingPackageId}::voting::vote`,
      arguments: [tx.object(src.id), tx.pure.bool(vote === "yes")],
    });

    performTransactionMutation.mutate({
      transaction: tx,
      enoki: {
        allowedMoveCallTargets: [
          `${networkVariables.votingPackageId}::voting::vote`,
        ],
        allowedAddresses: undefined,
      },
      onTransactionWait: async () => {
        await queryClient.refetchQueries();
      },
    });
  }

  const isVotingDisabled = !currentAccount || voteQuery.data !== null;

  return (
    <div className="rounded-md overflow-hidden border w-full px-3 py-2 wrap-normal empty:hidden flex flex-col gap-6">
      {src.statement}

      <div className="flex flex-col gap-2">
        <Button
          disabled={isVotingDisabled}
          className="bg-green-600 hover:bg-green-600/80 text-white"
          onClick={() => onClick("yes")}
        >
          {voteQuery.data === "yes" && <CheckIcon />}Yes ({src.yes} votes)
        </Button>
        <Button
          disabled={isVotingDisabled}
          className="bg-red-500 hover:bg-red-500/80 text-white"
          onClick={() => onClick("no")}
        >
          {voteQuery.data === "no" && <CheckIcon />}No ({src.no} votes)
        </Button>
      </div>
    </div>
  );
}
