import { SignUp, SignedIn, SignedOut, SignOutButton } from "@clerk/nextjs";
import Link from "next/link";

export default function Register() {
  return (
    <>
      <SignedOut>
        <SignUp />
      </SignedOut>
      <SignedIn>
        <p className="text-center">
          You are signed in. <Link href="/">Go Home</Link>
          <br /> <SignOutButton>Logout</SignOutButton>
        </p>
      </SignedIn>
    </>
  );
}
