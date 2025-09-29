import { useSuiClientQuery } from "@mysten/dapp-kit";
import type { DynamicFieldInfo } from "@mysten/sui/client";

export function useMessageIdsQuery({ parentId }: { parentId: string }) {
  return useSuiClientQuery(
    "getDynamicFields",
    {
      parentId,
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

function transformData(src: DynamicFieldInfo[]): string[] {
  return src.map((x) => x.objectId);
}
