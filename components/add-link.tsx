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
import { randomHSL } from "@/utils";
import { Button } from "./ui/button";

const formSchema = z.object({
  anchor: z.string().min(1).max(32),
  href: z.string().min(1).max(2048),
  color: z.optional(z.string().min(1).max(32)),
  weight: z.optional(z.number().min(0).max(100)),
});

export default function AddLink() {
  const createLink = useMutation(api.links.createLink);
  const defaultColor = randomHSL();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      anchor: "",
      href: "",
      color: `hsl(${defaultColor.hue}, ${defaultColor.sat}%, ${defaultColor.lum}%)`,
      weight: 0,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await createLink({
      anchor: values.anchor,
      href: values.href,
      color: values.color,
      weight: values.weight,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="anchor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Anchor</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="href"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Href</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Color</FormLabel>
              <FormControl>
                <Input type="color" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="weight"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Weight</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit">Add Link</Button>
      </form>
    </Form>
  );
}
