import { api } from "@/convex/_generated/api";
import { preloadedQueryResult, preloadQuery } from "convex/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import UserHandleForm from "./user-handle-form";

export default async function UserHandle() {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  const preloadedUser = await preloadQuery(api.users.getUserById, {
    userId: user.id,
  });

  const userResult = preloadedQueryResult(preloadedUser);

  if (!userResult) {
    return null;
  }

  return <UserHandleForm handle={userResult.handle ?? ""} />;
}
