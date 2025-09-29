import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { SendIcon } from "lucide-react";
import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
  useSuiClient,
} from "@mysten/dapp-kit";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import useDisclosure from "@/hooks/useDisclosure";
import { Transaction } from "@mysten/sui/transactions";
import { useQueryClient } from "@tanstack/react-query";

const formSchema = z.object({
  message: z.string().min(3).max(99),
});

export function SendMessageButton() {
  const queryClient = useQueryClient();

  const signAndExecuteTransactionMutation = useSignAndExecuteTransaction();
  const suiClient = useSuiClient();
  const currentAccount = useCurrentAccount();

  const dialog = useDisclosure();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });

  function onSubmit(variables: z.infer<typeof formSchema>) {
    if (!currentAccount) return;

    const tx = new Transaction();
    tx.moveCall({
      target:
        "0xfb37e62cb463f5c26e6b39d9b90efc20c68b1803a884bb40e5fc93c8acf1e036::guestbook::leave_message",
      arguments: [
        tx.sharedObjectRef({
          objectId:
            "0x8d6896d8d301199c03807fd0de93e15014ea2c65100c1736824b4d1aa89dc746",
          mutable: true,
          initialSharedVersion: "349179980",
        }),
        tx.pure.string(variables.message),
      ],
    });

    signAndExecuteTransactionMutation.mutate(
      {
        transaction: tx,
        chain: "sui:testnet",
      },
      {
        onSuccess: (tx) => {
          suiClient.waitForTransaction({ digest: tx.digest }).then(async () => {
            await queryClient.refetchQueries();
          });
        },
      }
    );

    dialog.onClose();
  }

  return (
    <>
      <Button onClick={dialog.onOpen}>
        Send a message <SendIcon />
      </Button>
      <Dialog open={dialog.isOpen} onOpenChange={dialog.onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send a message</DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Input placeholder="Pretty message..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                disabled={signAndExecuteTransactionMutation.isPending}
                type="submit"
              >
                Send
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
