import type { SuiMessage } from "@/types";
import { useSuiClientQuery } from "@mysten/dapp-kit";

export function useMessageByIdQuery({ id }: { id: string }) {
  return useSuiClientQuery(
    "getObject",
    {
      id,
      options: {
        showContent: true,
        showBcs: true,
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
