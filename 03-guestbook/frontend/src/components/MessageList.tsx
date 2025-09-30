import { useMessageByIdQuery } from "@/hooks/useMessageByIdQuery";
import { useMessageIdsQuery } from "@/hooks/useMessageIdsQuery";
import { LoaderCircleIcon } from "lucide-react";
import { Button } from "./ui/button";
import React from "react";
import { useNetworkVariables } from "@/config/network";

export function MessageList() {
  const networkVariables = useNetworkVariables();
  const messagesObjectIdQuery = useMessageIdsQuery({
    guestbookId: networkVariables.guestbookId,
  });

  if (messagesObjectIdQuery.isPending)
    return <LoaderCircleIcon className="animate-spin" />;

  if (messagesObjectIdQuery.isError) return <div>Smth. went wrong ⛔</div>;

  if (!messagesObjectIdQuery.data.pages[0]?.data.length)
    return <div>There are no messages in guestbook 😔</div>;

  return (
    <div className="flex flex-col gap-4 items-start">
      <div className="w-full flex flex-col gap-2">
        {messagesObjectIdQuery.data.pages.map((page, index) => (
          <React.Fragment key={index}>
            {page.data.map((messageId) => (
              <MessageListItem key={messageId} messageId={messageId} />
            ))}
          </React.Fragment>
        ))}
      </div>
      <Button
        disabled={
          !messagesObjectIdQuery.hasNextPage ||
          messagesObjectIdQuery.isFetchingNextPage
        }
        onClick={() => messagesObjectIdQuery.fetchNextPage()}
      >
        Load more
        {messagesObjectIdQuery.isFetchingNextPage && (
          <LoaderCircleIcon className="animate-spin" />
        )}
      </Button>
    </div>
  );
}

type MessageListItemProps = {
  messageId: string;
};

function MessageListItem({ messageId }: MessageListItemProps) {
  const messageByIdQuery = useMessageByIdQuery({ messageId });

  return (
    <div className="rounded-md overflow-hidden border w-full px-3 py-2 wrap-normal empty:hidden">
      {messageByIdQuery.isPending ? (
        <LoaderCircleIcon className="animate-spin" />
      ) : messageByIdQuery.isError ? (
        "Smth. went wrong ⛔"
      ) : (
        messageByIdQuery.data
      )}
    </div>
  );
}
