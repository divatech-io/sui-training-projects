import { ConnectButton } from "@/components/ConnectButton";
import { MessageList } from "@/components/MessageList";
import { SendMessageButton } from "@/components/SendMessageButton";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function MainPage() {
  return (
    <div className="@container">
      <div className="mx-auto @3xl:w-[48rem] @3xl:px-0 p-4 space-y-8 relative">
        <div className="flex flex-wrap gap-2">
          <ConnectButton />
          <SendMessageButton />
          <ThemeToggle />
        </div>

        <div className="space-y-2">
          <div className="text-2xl font-semibold">Messages</div>
          <MessageList />
        </div>
      </div>
    </div>
  );
}
