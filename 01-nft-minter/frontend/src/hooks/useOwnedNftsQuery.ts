import { useNetworkVariables } from "@/config/network";
import type { Nft, RpcNft } from "@/types";
import { useSuiClientInfiniteQuery } from "@mysten/dapp-kit";
import type { SuiObjectResponse } from "@mysten/sui/client";

export function useOwnedNftsQuery({
  ownerAddress,
}: {
  ownerAddress: string | undefined;
}) {
  const networkVariables = useNetworkVariables();

  return useSuiClientInfiniteQuery(
    "getOwnedObjects",
    {
      owner: ownerAddress!,
      filter: {
        MatchAll: [
          {
            StructType: `${networkVariables.nftMinterPackageId}::nft::NFT`,
          },
        ],
      },
      limit: 16,
      options: {
        showContent: true,
      },
    },
    {
      enabled: !!ownerAddress,
      select: (data) => {
        return {
          ...data,
          pages: data.pages.map((x) => ({
            ...x,
            data: transformData(x.data),
          })),
        };
      },
    }
  );
}

function transformData(src: SuiObjectResponse[]): Nft[] {
  return src
    .map((x) => {
      const content = x.data?.content;
      if (content?.dataType === "moveObject") {
        const fields = content.fields as RpcNft;

        return {
          name: fields.name,
          photoUrl: fields.metadata_url,
        };
      }

      return undefined;
    })
    .filter((x) => !!x);
}
