import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { CoffeeIcon } from "lucide-react";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";

const formSchema = z.object({
  amount: z.coerce.number<number>().min(0.01),
});

export function LeaveTipButton() {
  const currentAccount = useCurrentAccount();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 0.01,
    },
  });

  function onSubmit(variables: z.infer<typeof formSchema>) {
    console.log(variables);
  }

  if (!currentAccount) return null;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          Leave a tip <CoffeeIcon />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Leave a tip</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://example.com/image.png"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Pay</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
