import { api } from "@/convex/_generated/api";
import { preloadedQueryResult, preloadQuery } from "convex/nextjs";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import UserPicture from "@/components/user-picture";
import { currentUser } from "@clerk/nextjs/server";
import AddLink from "@/components/add-link";

export default async function UserPage({ handle }: { handle: string }) {
  const user = await preloadQuery(api.users.getUserByHandle, {
    handle: handle,
  });

  const userResult = preloadedQueryResult(user);

  if (!userResult) {
    return <div>User not found</div>;
  }

  const userId = userResult.userId;

  const links = await preloadQuery(api.links.readUserLinksByHandle, {
    handle: handle,
  });

  const linksResult = preloadedQueryResult(links);

  if (!linksResult) {
    return (
      <div>
        @{handle} {"hasn't added any links yet."}
      </div>
    );
  }

  const cUser = await currentUser();

  const isPro = await preloadQuery(api.users.isPro, {});
  const isUnlimited = await preloadQuery(api.users.isUnlimited, {});

  const isProResult = preloadedQueryResult(isPro);
  const isUnlimitedResult = preloadedQueryResult(isUnlimited);

  let maxLinks = 5;

  if (isProResult.length > 0) {
    maxLinks = 15;
  }

  if (isUnlimitedResult.length > 0) {
    maxLinks = Infinity;
  }

  return (
    <>
      <Suspense fallback={<Skeleton />}>
        <div>
          <UserPicture userId={userId} />
          <h1>{handle}</h1>
        </div>
        {linksResult ? (
          linksResult.map((link) => (
            <div key={link._id}>
              <Link href={link.href}>
                <Button asChild className={`border-color-[${link.color}]`}>
                  {link.anchor}
                </Button>
              </Link>
            </div>
          ))
        ) : (
          <div>
            @{handle} {"hasn't added any links yet."}
          </div>
        )}
      </Suspense>
      {cUser && cUser.id === userId && (
        <>
          <h2>Add Link</h2>
          {linksResult.length >= maxLinks ? (
            <>
              <p>
                {"You've reached the maximum number of links for your plan."}
              </p>
              <p>
                <Link href="/pricing">
                  <Button asChild>Upgrade</Button>
                </Link>
              </p>
            </>
          ) : (
            <AddLink />
          )}
        </>
      )}
    </>
  );
}
