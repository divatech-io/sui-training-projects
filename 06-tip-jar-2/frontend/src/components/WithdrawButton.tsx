import { Button } from "./ui/button";
import { DownloadIcon, LoaderCircleIcon, XCircleIcon } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Transaction } from "@mysten/sui/transactions";
import { useNetworkVariables } from "@/config/network";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { usePerformEnokiTransaction } from "@/hooks/usePerformEnokiTransaction";
import { useIsAdminQuery } from "@/hooks/useIsAdminQuery";

export function WithdrawButton() {
  const performTransactionMutation = usePerformEnokiTransaction();
  const queryClient = useQueryClient();
  const networkVariables = useNetworkVariables();
  const currentAccount = useCurrentAccount();
  const isAdminQuery = useIsAdminQuery({
    ownerAddress: currentAccount?.address,
  });

  function onClick() {
    const tx = new Transaction();
    const coin = tx.splitCoins(tx.gas, [
      tx.object(""),
      tx.object(networkVariables.tipJarId),
    ]);

    tx.moveCall({
      target: `${networkVariables.tipJarPackageId}::tipjar::withdraw`,
      arguments: [tx.object(networkVariables.tipJarId), tx.object(coin)],
    });

    performTransactionMutation.mutate({
      transaction: tx,
      enoki: {
        allowedMoveCallTargets: [
          `${networkVariables.tipJarPackageId}::tipjar::withdraw`,
        ],
        allowedAddresses: undefined,
      },
      onTransactionWait: async () => {
        await queryClient.refetchQueries();
      },
    });
  }

  if (!currentAccount) return null;

  if (isAdminQuery.isPending)
    return <LoaderCircleIcon className="animate-spin" />;

  if (isAdminQuery.isError)
    return (
      <Button variant={"destructive"}>
        Error <XCircleIcon />
      </Button>
    );

  if (!isAdminQuery.data) return null;

  return (
    <Button onClick={onClick}>
      Withdraw <DownloadIcon />
    </Button>
  );
}
