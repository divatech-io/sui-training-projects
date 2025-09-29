import { Button } from "./ui/button";
import { DownloadIcon, LoaderCircleIcon, XCircleIcon } from "lucide-react";
import { useSignAndExecuteTransaction, useSuiClient } from "@mysten/dapp-kit";
import { useQueryClient } from "@tanstack/react-query";
import { Transaction } from "@mysten/sui/transactions";
import type { WalletAccount } from "@mysten/wallet-standard";
import { useIsAlreadyClaimedQuery } from "@/hooks/useIsAlreadyClaimedQuery";
import { FAUCET_OBJECT_ID, FAUCET_PACKAGE_OBJECT_ID } from "@/config/objects";

type GetTokensButtonProps = {
  account: WalletAccount;
};

export function GetTokensButton({ account }: GetTokensButtonProps) {
  const queryClient = useQueryClient();

  const signAndExecuteTransactionMutation = useSignAndExecuteTransaction();
  const suiClient = useSuiClient();

  const isAlreadyClaimedQuery = useIsAlreadyClaimedQuery({
    faucet: FAUCET_OBJECT_ID,
    account: account.address,
  });

  function onClick() {
    const tx = new Transaction();

    tx.moveCall({
      target: `${FAUCET_PACKAGE_OBJECT_ID}::faucet::get_tokes`,
      arguments: [
        tx.sharedObjectRef({
          objectId: FAUCET_OBJECT_ID,
          mutable: true,
          initialSharedVersion: "349179981",
        }),
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
  }

  if (isAlreadyClaimedQuery.isPending)
    return <LoaderCircleIcon className="animate-spin" />;
  if (isAlreadyClaimedQuery.isError)
    return (
      <Button variant={"destructive"}>
        Error <XCircleIcon />
      </Button>
    );
  if (isAlreadyClaimedQuery.data) return <Button disabled>Claimed</Button>;

  return (
    <Button onClick={onClick}>
      Get tokens <DownloadIcon />
    </Button>
  );
}
