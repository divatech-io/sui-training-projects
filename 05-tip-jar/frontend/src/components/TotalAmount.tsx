import { useTotalAmountQuery } from "@/hooks/useTotalAmountQuery";
import { SuiIcon } from "./ui/icons";
import { LoaderCircle } from "lucide-react";
import { fromNano } from "@/config/sui";

export function TotalAmount() {
  const totalAmountQuery = useTotalAmountQuery({
    tipJar:
      "0xe862e8b1e73b0363bbd581b21b9a3a9c72932ffc7971e8a663417b96a41aebea",
  });

  if (totalAmountQuery.isPending)
    return <LoaderCircle className="animate-spin size-6" />;
  if (totalAmountQuery.isError || !totalAmountQuery.data)
    return <div className="text-4xl font-bold">Smth. went wrong ⛔</div>;

  return (
    <div className="text-4xl font-bold">
      {fromNano(totalAmountQuery.data)} <SuiIcon className="inline sixe-6" />
    </div>
  );
}
