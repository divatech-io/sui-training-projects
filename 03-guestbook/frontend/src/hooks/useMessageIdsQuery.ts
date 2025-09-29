import { useSuiClientQuery } from "@mysten/dapp-kit";
import type { DynamicFieldInfo } from "@mysten/sui/client";

export function useMessageIdsQuery({ guestbook }: { guestbook: string }) {
  return useSuiClientQuery(
    "getDynamicFields",
    {
      parentId: guestbook,
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
