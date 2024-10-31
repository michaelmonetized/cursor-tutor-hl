import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import UserHandle from "@/components/user-handle";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { Suspense } from "react";

export default async function Home() {
  const user = await currentUser();
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
      <Suspense fallback={<Skeleton />}>
        <SignedOut>
          <SignInButton>
            <Button asChild>Sign In</Button>
          </SignInButton>
          <SignUpButton>
            <Button asChild>Sign Up</Button>
          </SignUpButton>
        </SignedOut>
      </Suspense>
      <Suspense fallback={<Skeleton />}>
        <SignedIn>
          <UserButton />
          <h3>Welcome {user?.firstName}</h3>
          <SignOutButton>
            <Button asChild>Sign Out</Button>
          </SignOutButton>
        </SignedIn>
      </Suspense>
      <UserHandle />
    </>
  );
}
