export function MessageList() {
  const messages: string[] = [
    "Hello guys",
    "How are you?",
    "Where are my Sui tokens",
  ];

  if (!messages.length) return <div>You haven't minted any NFTs yet 😔</div>;

  return (
    <div className="w-full flex flex-col gap-2">
      {messages.map((message, index) => (
        <MessageListItem key={index} src={message} />
      ))}
    </div>
  );
}

type MessageListItemProps = {
  src: string;
};

function MessageListItem({ src }: MessageListItemProps) {
  return (
    <div className="rounded-md overflow-hidden border w-full px-3 py-2 wrap-normal">
      {src}
    </div>
  );
}
