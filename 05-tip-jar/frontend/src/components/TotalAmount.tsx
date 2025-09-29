import { useTotalAmountQuery } from "@/hooks/useTotalAmountQuery";
import { SuiIcon } from "./ui/icons";
import { LoaderCircle } from "lucide-react";
import { fromMist } from "@/lib/sui";
import { TIP_JAR_OBJECT_ID } from "@/config/objects";

export function TotalAmount() {
  const totalAmountQuery = useTotalAmountQuery({
    tipJar: TIP_JAR_OBJECT_ID,
  });

  if (totalAmountQuery.isPending)
    return <LoaderCircle className="animate-spin size-6" />;
  if (totalAmountQuery.isError || !totalAmountQuery.data)
    return <div className="text-4xl font-bold">Smth. went wrong ⛔</div>;

  return (
    <div className="text-4xl font-bold">
      {fromMist(totalAmountQuery.data)} <SuiIcon className="inline sixe-6" />
    </div>
  );
}
