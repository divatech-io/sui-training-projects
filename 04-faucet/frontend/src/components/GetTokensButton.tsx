import { Button } from "./ui/button";
import { DownloadIcon, LoaderCircleIcon, XCircleIcon } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Transaction } from "@mysten/sui/transactions";
import type { WalletAccount } from "@mysten/wallet-standard";
import { useIsAlreadyClaimedQuery } from "@/hooks/useIsAlreadyClaimedQuery";
import { FAUCET_OBJECT_ID, FAUCET_PACKAGE_OBJECT_ID } from "@/config/objects";
import { usePerformEnokiTransaction } from "@/hooks/usePerformEnokiTransaction";

type GetTokensButtonProps = {
  account: WalletAccount;
};

export function GetTokensButton({ account }: GetTokensButtonProps) {
  const performTransactionMutation = usePerformEnokiTransaction();
  const queryClient = useQueryClient();

  const isAlreadyClaimedQuery = useIsAlreadyClaimedQuery({
    faucet: FAUCET_OBJECT_ID,
    account: account.address,
  });

  function onClick() {
    const tx = new Transaction();

    tx.moveCall({
      target: `${FAUCET_PACKAGE_OBJECT_ID}::faucet::get_tokes`,
      arguments: [tx.object(FAUCET_OBJECT_ID)],
    });

    performTransactionMutation.mutate({
      transaction: tx,
      enoki: {
        allowedMoveCallTargets: [
          `${FAUCET_PACKAGE_OBJECT_ID}::faucet::get_tokes`,
        ],
        allowedAddresses: undefined,
      },
      onTransactionWait: async () => {
        await queryClient.refetchQueries();
      },
    });
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
    <Button onClick={onClick} disabled={performTransactionMutation.isPending}>
      Get tokens <DownloadIcon />
    </Button>
  );
}
