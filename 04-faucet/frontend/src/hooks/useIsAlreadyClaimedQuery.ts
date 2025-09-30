import { useSuiClientQuery } from "@mysten/dapp-kit";

export function useIsAlreadyClaimedQuery({
  faucet,
  account,
}: {
  faucet: string;
  account: string;
}) {
  return useSuiClientQuery(
    "getDynamicFieldObject",
    {
      parentId: faucet,
      name: {
        type: "address",
        value: account,
      },
    },
    {
      select: (data) => {
        return !data.error;
      },
    }
  );
}
