import { auth } from "@/auth";
import Appbar from "@/components/Appbar";

export default async function Page() {
  const session = await auth();
  const isAuthenticated = !!session?.user;

  console.log(session)

  return (
    <div>
      <Appbar isAuthenticated={isAuthenticated} user={session?.user} />
    </div>
  );
}