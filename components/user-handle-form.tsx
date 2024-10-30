"use client";
import { useMutation } from "convex/react";
import { useForm } from "react-hook-form";
import { api } from "@/convex/_generated/api";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "./ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";

const formSchema = z.object({
  handle: z
    .string()
    .min(1)
    .max(32)
    .regex(/^[a-zA-Z0-9]+$/),
});

export default function UserHandleForm({ handle }: { handle: string }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      handle,
    },
  });

  const setUniqueUserHandle = useMutation(api.users.setUniqueUserHandle);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await setUniqueUserHandle({
      handle: values.handle,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="handle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Handle</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
