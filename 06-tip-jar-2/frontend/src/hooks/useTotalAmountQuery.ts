import type { RpcTipJar } from "@/types";
import { useSuiClientQuery } from "@mysten/dapp-kit";

export function useTotalAmountQuery({ tipJarId }: { tipJarId: string }) {
  return useSuiClientQuery(
    "getObject",
    {
      id: tipJarId,
      options: {
        showContent: true,
      },
    },
    {
      select: (data) => {
        if (data.data?.content?.dataType !== "moveObject") {
          return undefined;
        }
        return (data.data.content.fields as RpcTipJar).balance;
      },
    }
  );
}
