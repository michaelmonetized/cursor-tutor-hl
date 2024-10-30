import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/convex/_generated/api";
import { useAction } from "convex/react";

const monthlyPackages = [
  {
    name: "Pro",
    priceId: "price_1QFOfmDQtisrXovAo0yulTQe",
    price: 14.99,
    description:
      "Pro link service for your get at me profile. Add up to 15 links, add colors to your links, and sort your links.",
    features: ["Add up to 15 links", "Set link color", "Sort links"],
  },
  {
    name: "Unlimited",
    priceId: "price_1QFOjgDQtisrXovAmiXnYEzy",
    price: 29.99,
    description: "Add unlimited links, + all pro features",
  },
];

const yearlyPackages = [
  {
    name: "Pro",
    description:
      "Save $30/year when you pay annually. Pro link service for your get at me profile. Add up to 15 links, add colors to your links, and sort your links.",
    priceId: "price_1QFZPtDQtisrXovAEvcGfnCl",
    price: 149.88,
  },
  {
    name: "Unlimited",
    description:
      "Save $60/year when you pay annually. Add unlimited links, + all pro features",
    priceId: "price_1QFZPRDQtisrXovAxWAdWX2g",
    price: 329.88,
  },
];

export default function Pricing() {
  const pay = useAction(api.stripe.pay);

  const handlePay = async (priceId: string) => {
    await pay({
      lineItems: [{ price: priceId, quantity: 1 }],
    });
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold">Pricing</h1>
      <Tabs defaultValue="yearly" className="w-[400px]">
        <TabsList>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
          <TabsTrigger value="yearly">Yearly</TabsTrigger>
        </TabsList>
        <TabsContent value="monthly">
          {monthlyPackages.map((pkg) => (
            <Card key={pkg.priceId}>
              <CardHeader>
                <CardTitle>{pkg.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{pkg.description}</p>
              </CardContent>
              <CardFooter>
                <Button onClick={() => handlePay(pkg.priceId)}>
                  Subscribe
                </Button>
              </CardFooter>
            </Card>
          ))}
        </TabsContent>
        <TabsContent value="yearly">
          {yearlyPackages.map((pkg) => (
            <Card key={pkg.priceId}>
              <CardHeader>
                <CardTitle>{pkg.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{pkg.description}</p>
              </CardContent>
              <CardFooter>
                <Button onClick={() => handlePay(pkg.priceId)}>
                  Subscribe
                </Button>
              </CardFooter>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
