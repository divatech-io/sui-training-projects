import type { SuiTipJar } from "@/types";
import { useSuiClientQuery } from "@mysten/dapp-kit";

export function useTotalAmountQuery({ tipJar }: { tipJar: string }) {
  return useSuiClientQuery(
    "getObject",
    {
      id: tipJar,
      options: {
        showContent: true,
      },
    },
    {
      select: (data) => {
        if (data.data?.content?.dataType !== "moveObject") {
          return undefined;
        }
        return (data.data.content.fields as SuiTipJar).total;
      },
    }
  );
}
