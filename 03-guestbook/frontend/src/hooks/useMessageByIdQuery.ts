import type { SuiMessage } from "@/types";
import { useSuiClientQuery } from "@mysten/dapp-kit";

export function useMessageByIdQuery({ objectId }: { objectId: string }) {
  return useSuiClientQuery(
    "getObject",
    {
      id: objectId,
      options: {
        showContent: true,
      },
    },
    {
      select: (data) => {
        const content = data.data?.content;
        if (content?.dataType === "moveObject") {
          return (content.fields as SuiMessage).value;
        }
      },
    }
  );
}
