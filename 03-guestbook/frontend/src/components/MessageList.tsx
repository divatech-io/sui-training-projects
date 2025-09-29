import { useMessageByIdQuery } from "@/hooks/useMessageByIdQuery";
import { useMessageIdsQuery } from "@/hooks/useMessageIdsQuery";
import { LoaderCircleIcon } from "lucide-react";

export function MessageList() {
  const messagesObjectIdQuery = useMessageIdsQuery({
    parentId:
      "0x8d6896d8d301199c03807fd0de93e15014ea2c65100c1736824b4d1aa89dc746",
  });

  if (messagesObjectIdQuery.isPending)
    return <LoaderCircleIcon className="animate-spin" />;

  if (messagesObjectIdQuery.isError) return <div>Smth. went wrong ⛔</div>;

  const messagesObjectId = messagesObjectIdQuery.data.data;
  if (!messagesObjectId.length)
    return <div>There are no messages in guestbook 😔</div>;

  return (
    <div className="w-full flex flex-col gap-2">
      {messagesObjectId.map((id) => (
        <MessageListItem key={id} id={id} />
      ))}
    </div>
  );
}

type MessageListItemProps = {
  id: string;
};

function MessageListItem({ id }: MessageListItemProps) {
  const messageByIdQuery = useMessageByIdQuery({ id });

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
