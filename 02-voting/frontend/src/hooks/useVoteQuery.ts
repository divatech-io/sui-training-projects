import type { RpcVote, Vote } from "@/types";
import { useSuiClientQuery } from "@mysten/dapp-kit";

export function useVoteQuery({
  proposalId,
  voterAddress,
}: {
  proposalId: string;
  voterAddress?: string;
}) {
  return useSuiClientQuery(
    "getDynamicFieldObject",
    {
      parentId: proposalId,
      name: {
        type: "address",
        value: voterAddress!,
      },
    },
    {
      enabled: !!voterAddress,
      select: function (data): Vote | null {
        if (data.error) return null;
        if (data.data?.content?.dataType !== "moveObject") return null;

        return (data.data.content.fields as RpcVote).value ? "yes" : "no";
      },
    }
  );
}
