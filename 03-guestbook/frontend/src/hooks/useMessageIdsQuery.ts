import { useSuiClientInfiniteQuery } from "@mysten/dapp-kit";
import type { DynamicFieldInfo } from "@mysten/sui/client";

export function useMessageIdsQuery({ guestbookId }: { guestbookId: string }) {
  return useSuiClientInfiniteQuery(
    "getDynamicFields",
    {
      parentId: guestbookId,
      limit: 20,
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

function transformData(src: DynamicFieldInfo[]): string[] {
  return src.map((x) => x.objectId);
}
