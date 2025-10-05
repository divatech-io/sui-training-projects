import { useNetworkVariables } from "@/config/network";
import type { RpcAdminCap } from "@/types";
import { useSuiClientQuery } from "@mysten/dapp-kit";
import type { SuiObjectResponse } from "@mysten/sui/client";

export function useIsAdminQuery({
  ownerAddress,
}: {
  ownerAddress: string | undefined;
}) {
  const networkVariables = useNetworkVariables();

  return useSuiClientQuery(
    "getOwnedObjects",
    {
      owner: ownerAddress!,
      filter: {
        MatchAll: [
          {
            StructType: `${networkVariables.tipJarPackageId}::tipjar::AdminCap`,
          },
        ],
      },
      options: {
        showContent: true,
      },
    },
    {
      enabled: !!ownerAddress,
      select: (data) => {
        return transformData(data.data);
      },
    }
  );
}

function transformData(src: SuiObjectResponse[]): boolean {
  return !!src
    .map((x) => {
      const content = x.data?.content;
      if (content?.dataType === "moveObject") {
        const fields = content.fields as RpcAdminCap;

        return {
          id: fields.id,
        };
      }

      return undefined;
    })
    .filter((x) => !!x)
    .at(0);
}
