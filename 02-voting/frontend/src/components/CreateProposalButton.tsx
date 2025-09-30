import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { FileIcon } from "lucide-react";
import { useCurrentAccount } from "@mysten/dapp-kit";
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
import { Transaction } from "@mysten/sui/transactions";
import { useDisclosure } from "@/hooks/useDisclosure";
import { useQueryClient } from "@tanstack/react-query";
import { VOTING_PACKAGE_OBJECT_ID } from "@/config/objects";
import { usePerformEnokiTransaction } from "@/hooks/usePerformEnokiTransaction";

const formSchema = z.object({
  statement: z.string().min(3).max(256),
});

export function CreateProposalButton() {
  const performTransactionMutation = usePerformEnokiTransaction();
  const queryClient = useQueryClient();

  const currentAccount = useCurrentAccount();

  const dialog = useDisclosure();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      statement: "",
    },
  });

  function onSubmit(variables: z.infer<typeof formSchema>) {
    if (!currentAccount) return;

    const tx = new Transaction();
    tx.moveCall({
      target: `${VOTING_PACKAGE_OBJECT_ID}::voting::create_proposal`,
      arguments: [tx.pure.string(variables.statement)],
    });

    performTransactionMutation.mutate({
      transaction: tx,
      enoki: {
        allowedMoveCallTargets: [
          `${VOTING_PACKAGE_OBJECT_ID}::voting::create_proposal`,
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
        Create Proposal <FileIcon />
      </Button>
      <Dialog open={dialog.isOpen} onOpenChange={dialog.onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Proposal</DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="statement"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Statement</FormLabel>
                    <FormControl>
                      <Input placeholder="Do you agree?" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                disabled={performTransactionMutation.isPending}
                type="submit"
              >
                Create
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
