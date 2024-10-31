import Link from "next/link";
import { Button } from "./ui/button";

export default function UserLink({
  link,
}: {
  link: {
    _id: string;
    userId: string;
    anchor: string;
    href: string;
    weight: number;
    color: string;
  };
}) {
  const { href, anchor, color } = link;
  return (
    <Link href={href}>
      <Button
        asChild
        className={`border-color-[${color}] bg-[${color}]/20 hover:bg-[${color}]/75 text-[${color}]`}
      >
        {anchor}
      </Button>
    </Link>
  );
}
