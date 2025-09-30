import type { RpcMessage } from "@/types";
import { useSuiClientQuery } from "@mysten/dapp-kit";

export function useMessageByIdQuery({ messageId }: { messageId: string }) {
  return useSuiClientQuery(
    "getObject",
    {
      id: messageId,
      options: {
        showContent: true,
      },
    },
    {
      select: (data) => {
        const content = data.data?.content;
        if (content?.dataType === "moveObject") {
          return (content.fields as RpcMessage).value;
        }
      },
    }
  );
}
