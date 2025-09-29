import type { Nft, SuiNft } from "@/types";
import { useSuiClientQuery } from "@mysten/dapp-kit";
import type { SuiObjectResponse } from "@mysten/sui/client";

export function useOwnedNftsQuery({ owner }: { owner: string }) {
  return useSuiClientQuery(
    "getOwnedObjects",
    {
      owner,
      filter: {
        MatchAll: [
          {
            StructType:
              "0x3a11a1a2c85f62b9b461949b840568c026e518200bd3ccdd872cfa4e4ba188ad::nft::NFT",
          },
        ],
      },
      options: {
        showContent: true,
      },
    },
    {
      select: (paginatedData) => {
        return {
          ...paginatedData,
          data: transformData(paginatedData.data),
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
