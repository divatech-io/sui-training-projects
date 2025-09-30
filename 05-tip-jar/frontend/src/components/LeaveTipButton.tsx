import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { CoffeeIcon } from "lucide-react";
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
import { useQueryClient } from "@tanstack/react-query";
import { Transaction } from "@mysten/sui/transactions";
import { toMist } from "@/lib/sui";
import { TIP_JAR_OBJECT_ID, TIP_JAR_PACKAGE_OBJECT_ID } from "@/config/objects";

const formSchema = z.object({
  amount: z.coerce.number<number>().min(0.01),
});

export function LeaveTipButton() {
  const queryClient = useQueryClient();

  const signAndExecuteTransactionMutation = useSignAndExecuteTransaction();
  const suiClient = useSuiClient();
  const currentAccount = useCurrentAccount();

  const dialog = useDisclosure();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 0.01,
    },
  });

  function onSubmit(variables: z.infer<typeof formSchema>) {
    if (!currentAccount) return;

    const tx = new Transaction();
    const coin = tx.splitCoins(tx.gas, [toMist(variables.amount)]);

    tx.moveCall({
      target: `${TIP_JAR_PACKAGE_OBJECT_ID}::tip_jar::receive_sui`,
      arguments: [tx.object(TIP_JAR_OBJECT_ID), tx.object(coin)],
    });

    signAndExecuteTransactionMutation.mutate(
      {
        transaction: tx,
        chain: "sui:testnet",
      },
      {
        onSuccess: (tx) => {
          dialog.onClose();
          suiClient.waitForTransaction({ digest: tx.digest }).then(async () => {
            await queryClient.refetchQueries();
          });
        },
      }
    );
  }

  return (
    <>
      <Button onClick={dialog.onOpen}>
        Leave a tip <CoffeeIcon />
      </Button>

      <Dialog open={dialog.isOpen} onOpenChange={dialog.onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Leave a tip</DialogTitle>
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
                disabled={signAndExecuteTransactionMutation.isPending}
                type="submit"
              >
                Pay
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
