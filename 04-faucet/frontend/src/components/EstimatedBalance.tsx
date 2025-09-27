import { SuiIcon } from "./ui/icons";

export function EstimatedBalance() {
  const estimatedBalance = 1000;

  return (
    <div className="text-4xl font-bold">
      {estimatedBalance} <SuiIcon className="inline sixe-6" />
    </div>
  );
}
