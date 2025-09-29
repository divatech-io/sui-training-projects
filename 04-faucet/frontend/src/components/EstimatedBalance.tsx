import { SuiIcon } from "./ui/icons";
import { LoaderCircle } from "lucide-react";
import { fromMist } from "@/lib/sui";
import { useEstimatedBalanceQuery } from "@/hooks/useEstimatedBalanceQuery";

export function EstimatedBalance() {
  const estimatedBalanceQuery = useEstimatedBalanceQuery({
    faucet:
      "0x832c9292a54c0b2b2a20ff328c02bb212990c2c3d9dc22ba9caf7b85162483be",
  });

  if (estimatedBalanceQuery.isPending)
    return <LoaderCircle className="animate-spin size-6" />;
  if (estimatedBalanceQuery.isError || !estimatedBalanceQuery.data)
    return <div className="text-4xl font-bold">Smth. went wrong ⛔</div>;

  return (
    <div className="text-4xl font-bold">
      {fromMist(estimatedBalanceQuery.data)}{" "}
      <SuiIcon className="inline sixe-6" />
    </div>
  );
}
