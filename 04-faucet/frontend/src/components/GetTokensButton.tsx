import { Button } from "./ui/button";
import { DownloadIcon } from "lucide-react";
import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
  useSuiClient,
} from "@mysten/dapp-kit";
import { useQueryClient } from "@tanstack/react-query";
import { Transaction } from "@mysten/sui/transactions";

export function GetTokensButton() {
  const queryClient = useQueryClient();

  const signAndExecuteTransactionMutation = useSignAndExecuteTransaction();
  const suiClient = useSuiClient();
  const currentAccount = useCurrentAccount();

  function onClick() {
    if (!currentAccount) return;

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

  if (!currentAccount) return null;

  return (
    <Button onClick={onClick}>
      Get tokens <DownloadIcon />
    </Button>
  );
}
