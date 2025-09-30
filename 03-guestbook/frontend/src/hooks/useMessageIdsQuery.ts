import { useSuiClientInfiniteQuery } from "@mysten/dapp-kit";
import type { DynamicFieldInfo } from "@mysten/sui/client";

export function useMessageIdsQuery({ guestbook }: { guestbook: string }) {
  return useSuiClientInfiniteQuery(
    "getDynamicFields",
    {
      parentId: guestbook,
      limit: 8,
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
