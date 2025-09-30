import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { SendIcon } from "lucide-react";
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
import { useDisclosure } from "@/hooks/useDisclosure";
import { Transaction } from "@mysten/sui/transactions";
import { useQueryClient } from "@tanstack/react-query";
import { usePerformEnokiTransaction } from "@/hooks/usePerformEnokiTransaction";
import { useNetworkVariables } from "@/config/network";
import { useCurrentAccount } from "@mysten/dapp-kit";

const formSchema = z.object({
  message: z.string().min(3).max(99),
});

export function SendMessageButton() {
  const performTransactionMutation = usePerformEnokiTransaction();
  const queryClient = useQueryClient();
  const networkVariables = useNetworkVariables();
  const currentAccount = useCurrentAccount();

  const dialog = useDisclosure();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });

  function onSubmit(variables: z.infer<typeof formSchema>) {
    const tx = new Transaction();
    tx.moveCall({
      target: `${networkVariables.guestbookPackageId}::guestbook::leave_message`,
      arguments: [
        tx.object(networkVariables.guestbookId),
        tx.pure.string(variables.message),
      ],
    });

    performTransactionMutation.mutate({
      transaction: tx,
      enoki: {
        allowedMoveCallTargets: [
          `${networkVariables.guestbookPackageId}::guestbook::leave_message`,
        ],
        allowedAddresses: undefined,
      },
      onSign: async () => {
        dialog.onClose();
      },
      onTransactionWait: async () => {
        await queryClient.refetchQueries();
      },
    });
  }

  if (!currentAccount) return null;

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
                disabled={performTransactionMutation.isPending}
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
