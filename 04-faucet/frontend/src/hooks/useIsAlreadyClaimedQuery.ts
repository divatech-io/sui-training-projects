import { useSuiClientQuery } from "@mysten/dapp-kit";

export function useIsAlreadyClaimedQuery({
  faucet,
  account,
}: {
  faucet: string;
  account: string;
}) {
  return useSuiClientQuery(
    "getDynamicFields",
    {
      parentId: faucet,
    },
    {
      select: (paginatedData) => {
        let isAlreadyClaimed = false;
        paginatedData.data.forEach((x) => {
          if (x.name.value === account) isAlreadyClaimed = true;
        });

        return isAlreadyClaimed;
      },
    }
  );
}
