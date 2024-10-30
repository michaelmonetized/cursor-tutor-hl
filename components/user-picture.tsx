import { clerkClient } from "@clerk/nextjs/server";
import Image from "next/image";

export default async function UserPicture({ userId }: { userId: string }) {
  const userData = await clerkClient().then((client) =>
    client.users.getUser(userId)
  );
  const pictureUrl = userData?.imageUrl;
  return <Image src={pictureUrl} alt="User avatar" width={512} height={512} />;
}
