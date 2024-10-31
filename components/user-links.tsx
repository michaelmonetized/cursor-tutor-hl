"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import AddLink from "@/components/add-link";
import UserLink from "@/components/user-link";
export default function UserLinks() {
  const userLinks = useQuery(api.links.readLinks);

  return (
    <>
      {userLinks?.map((link) => (
        <div key={link._id}>
          <UserLink link={link} />
        </div>
      ))}
      <AddLink />
    </>
  );
}
