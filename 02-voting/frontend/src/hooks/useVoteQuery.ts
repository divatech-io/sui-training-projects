import type { SuiVote, Vote } from "@/types";
import { useSuiClientQuery } from "@mysten/dapp-kit";

export function useVoteQuery({
  proposal,
  account,
}: {
  proposal: string;
  account?: string;
}) {
  return useSuiClientQuery(
    "getDynamicFieldObject",
    {
      parentId: proposal,
      name: {
        type: "address",
        value: account,
      },
    },
    {
      enabled: !!account,
      select: function (data): Vote | null {
        if (data.error) return null;
        if (data.data?.content?.dataType !== "moveObject") return null;

        return (data.data.content.fields as SuiVote).value ? "yes" : "no";
      },
    }
  );
}
