import { GUESTBOOK_OBJECT_ID } from "@/config/objects";
import { useMessageByIdQuery } from "@/hooks/useMessageByIdQuery";
import { useMessageIdsQuery } from "@/hooks/useMessageIdsQuery";
import { LoaderCircleIcon } from "lucide-react";
import { Button } from "./ui/button";
import React from "react";

export function MessageList() {
  const messagesObjectIdQuery = useMessageIdsQuery({
    guestbook: GUESTBOOK_OBJECT_ID,
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
            {page.data.map((objectId) => (
              <MessageListItem key={objectId} objectId={objectId} />
            ))}
          </React.Fragment>
        ))}
      </div>
      <Button
        disabled={!messagesObjectIdQuery.hasNextPage}
        onClick={() => messagesObjectIdQuery.fetchNextPage()}
      >
        Load more
      </Button>
    </div>
  );
}

type MessageListItemProps = {
  objectId: string;
};

function MessageListItem({ objectId }: MessageListItemProps) {
  const messageByIdQuery = useMessageByIdQuery({ objectId });

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
