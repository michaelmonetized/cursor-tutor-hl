import { api } from "@/convex/_generated/api";
import {
  preloadedQueryResult,
  preloadQuery,
  fetchMutation,
} from "convex/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import UserHandleForm from "@/components/user-handle-form";

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
    await fetchMutation(api.users.createUserPublic, {
      handle: "",
      userId: user.id,
    });
  }

  return (
    <>
      <h2>{userResult?.handle}</h2>
      <UserHandleForm handle={userResult?.handle ?? ""} />
    </>
  );
}
