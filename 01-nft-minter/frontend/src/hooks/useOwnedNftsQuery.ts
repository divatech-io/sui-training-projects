import { NFT_MINTER_PACKAGE_OBJECT_ID } from "@/config/objects";
import type { Nft, SuiNft } from "@/types";
import { useSuiClientInfiniteQuery } from "@mysten/dapp-kit";
import type { SuiObjectResponse } from "@mysten/sui/client";

export function useOwnedNftsQuery({ owner }: { owner: string }) {
  return useSuiClientInfiniteQuery(
    "getOwnedObjects",
    {
      owner,
      filter: {
        MatchAll: [
          {
            StructType: `${NFT_MINTER_PACKAGE_OBJECT_ID}::nft::NFT`,
          },
        ],
      },
      limit: 6,
      options: {
        showContent: true,
      },
    },
    {
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
        const fields = content.fields as SuiNft;

        return {
          name: fields.name,
          photoUrl: fields.metadata_url,
        };
      }

      return undefined;
    })
    .filter((x) => !!x);
}
