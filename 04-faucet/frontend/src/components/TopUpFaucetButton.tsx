import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { UploadIcon } from "lucide-react";
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
import { useQueryClient } from "@tanstack/react-query";
import { Transaction } from "@mysten/sui/transactions";
import { FAUCET_OBJECT_ID, FAUCET_PACKAGE_OBJECT_ID } from "@/config/objects";
import { usePerformEnokiTransaction } from "@/hooks/usePerformEnokiTransaction";

const formSchema = z.object({
  amount: z.coerce.number<number>().min(0.01),
});

export function TopUpFaucetButton() {
  const performTransactionMutation = usePerformEnokiTransaction();
  const queryClient = useQueryClient();

  const dialog = useDisclosure();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 0.01,
    },
  });

  function onSubmit(variables: z.infer<typeof formSchema>) {
    const tx = new Transaction();
    const coin = tx.splitCoins(tx.gas, [variables.amount * 1000000000]);

    tx.moveCall({
      target: `${FAUCET_PACKAGE_OBJECT_ID}::faucet::top_up_faucet`,
      arguments: [tx.object(FAUCET_OBJECT_ID), tx.object(coin)],
    });

    performTransactionMutation.mutate({
      transaction: tx,
      enoki: {
        allowedMoveCallTargets: [
          `${FAUCET_PACKAGE_OBJECT_ID}::faucet::top_up_faucet`,
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

  return (
    <>
      <Button onClick={dialog.onOpen}>
        Top Up Faucet <UploadIcon />
      </Button>

      <Dialog open={dialog.isOpen} onOpenChange={dialog.onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Top Up Faucet</DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input placeholder="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                disabled={performTransactionMutation.isPending}
                type="submit"
              >
                Top Up
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
