import { SuiIcon } from "./ui/icons";

export function TotalAmount() {
  const amount = 1000;

  return (
    <div className="text-4xl font-bold">
      {amount} <SuiIcon className="inline sixe-6" />
    </div>
  );
}
