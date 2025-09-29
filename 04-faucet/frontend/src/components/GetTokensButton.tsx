import { Button } from "./ui/button";
import { DownloadIcon, LoaderCircleIcon, XCircleIcon } from "lucide-react";
import { useSignAndExecuteTransaction, useSuiClient } from "@mysten/dapp-kit";
import { useQueryClient } from "@tanstack/react-query";
import { Transaction } from "@mysten/sui/transactions";
import type { WalletAccount } from "@mysten/wallet-standard";
import { useIsAlreadyClaimedQuery } from "@/hooks/useIsAlreadyClaimedQuery";

type GetTokensButtonProps = {
  account: WalletAccount;
};

export function GetTokensButton({ account }: GetTokensButtonProps) {
  const queryClient = useQueryClient();

  const signAndExecuteTransactionMutation = useSignAndExecuteTransaction();
  const suiClient = useSuiClient();

  const isAlreadyClaimedQuery = useIsAlreadyClaimedQuery({
    faucet:
      "0x832c9292a54c0b2b2a20ff328c02bb212990c2c3d9dc22ba9caf7b85162483be",
    account: account.address,
  });

  function onClick() {
    const tx = new Transaction();

    tx.moveCall({
      target:
        "0x71909abc4133f661f1dc8aefeae962f6661dacaa3b4bbd739e3b7c6cd5520d1b::faucet::get_tokes",
      arguments: [
        tx.sharedObjectRef({
          objectId:
            "0x832c9292a54c0b2b2a20ff328c02bb212990c2c3d9dc22ba9caf7b85162483be",
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
