import Appbar from "@/components/Appbar";
import { auth } from "@/auth"; // Function to fetch the session
import UserAvatar from "@/components/UserAvatar";

export default async function Page() {
  const session = await auth();
  const isAuthenticated = !!session?.user; // Boolean: true if user is authenticated

  return (
    <div>
      <Appbar isAuthenticated={isAuthenticated}>
        <UserAvatar/>
      </Appbar>
    </div>
  );
}
