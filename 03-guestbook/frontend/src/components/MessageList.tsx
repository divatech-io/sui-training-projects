import { GUESTBOOK_OBJECT_ID } from "@/config/objects";
import { useMessageByIdQuery } from "@/hooks/useMessageByIdQuery";
import { useMessageIdsQuery } from "@/hooks/useMessageIdsQuery";
import { LoaderCircleIcon } from "lucide-react";

export function MessageList() {
  const messagesObjectIdQuery = useMessageIdsQuery({
    guestbook: GUESTBOOK_OBJECT_ID,
  });

  if (messagesObjectIdQuery.isPending)
    return <LoaderCircleIcon className="animate-spin" />;

  if (messagesObjectIdQuery.isError) return <div>Smth. went wrong ⛔</div>;

  const messagesObjectId = messagesObjectIdQuery.data.data;
  if (!messagesObjectId.length)
    return <div>There are no messages in guestbook 😔</div>;

  return (
    <div className="w-full flex flex-col gap-2">
      {messagesObjectId.map((objectId) => (
        <MessageListItem key={objectId} objectId={objectId} />
      ))}
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
