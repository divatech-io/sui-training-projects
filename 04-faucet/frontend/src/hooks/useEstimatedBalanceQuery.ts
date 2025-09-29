import type { SuiFaucet } from "@/types";
import { useSuiClientQuery } from "@mysten/dapp-kit";

export function useEstimatedBalanceQuery({ faucet }: { faucet: string }) {
  return useSuiClientQuery(
    "getObject",
    {
      id: faucet,
      options: {
        showContent: true,
      },
    },
    {
      select: (data) => {
        if (data.data?.content?.dataType !== "moveObject") {
          return undefined;
        }
        return (data.data.content.fields as SuiFaucet).balance;
      },
    }
  );
}
