import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { PlusIcon } from "lucide-react";
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
import useDisclosure from "@/hooks/useDisclosure";
import { NFT_MINTER_PACKAGE_OBJECT_ID } from "@/config/objects";
import { queryClient } from "@/config/tanstack-query";
import { usePerformEnokiTransaction } from "@/hooks/usePerformEnokiTransaction";

const formSchema = z.object({
  photoUrl: z.url(),
  name: z.string().min(3).max(100),
});

export function MintNftButton() {
  const performTransactionMutation = usePerformEnokiTransaction();
  const currentAccount = useCurrentAccount();

  const dialog = useDisclosure();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      photoUrl: "",
      name: "",
    },
  });

  async function onSubmit(variables: z.infer<typeof formSchema>) {
    if (!currentAccount) return;

    const tx = new Transaction();
    tx.moveCall({
      target: `${NFT_MINTER_PACKAGE_OBJECT_ID}::nft::mint`,
      arguments: [
        tx.pure.string(variables.name),
        tx.pure.string(variables.photoUrl),
      ],
    });

    performTransactionMutation.mutate({
      transaction: tx,
      enoki: {
        allowedMoveCallTargets: [`${NFT_MINTER_PACKAGE_OBJECT_ID}::nft::mint`],
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
        Mint NFT <PlusIcon />
      </Button>
      <Dialog open={dialog.isOpen} onOpenChange={dialog.onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mint NFT</DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="photoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Photo URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://example.com/image.png"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="My brand new NFT" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                disabled={performTransactionMutation.isPending}
                type="submit"
              >
                Mint
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
