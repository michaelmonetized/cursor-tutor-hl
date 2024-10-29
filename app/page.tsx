import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <h1 className="text-4xl font-bold">It works!</h1>
      <h2>Follow the cursor tutor walkthrough.</h2>
      <h2>
        {"Install and configure posthog, "}
        <Link href="https://www.posthog.com/" target="_blank">
          <Button asChild>Quick Start</Button>
        </Link>
      </h2>
      <h2>
        {"Install and configure Clerk, "}
        <Link href="https://clerk.com/" target="_blank">
          <Button asChild>Quick Start</Button>
        </Link>
      </h2>
      <h2>
        {"Install and configure Sentry, "}
        <Link href="https://sentry.io/" target="_blank">
          <Button asChild>Quick Start</Button>
        </Link>
      </h2>
      <h2>
        {"Install and configure Convex, "}
        <Link href="https://www.convex.dev/" target="_blank">
          <Button asChild>Quick Start</Button>
        </Link>
      </h2>
      <h2>
        {"Integrate Clerk, Convex and Stripe, "}
        <Link
          href="https://www.youtube.com/watch?v=Z8WzqQ51Q-Y"
          target="_blank"
        >
          <Button asChild>Watch Tutorial</Button>
        </Link>
      </h2>
    </>
  );
}
