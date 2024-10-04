import { auth } from "@/auth";
import Appbar from "@/components/Appbar";
import AnimatedLandingContent from "@/components/AnimatedLandingContent";

export default async function Page() {
  const session = await auth();
  const isAuthenticated = !!session?.user;

  return (
    <div>
      <Appbar isAuthenticated={isAuthenticated} user={session?.user} />
      <AnimatedLandingContent />
    </div>
  );
}