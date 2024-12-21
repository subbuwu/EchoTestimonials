import { auth } from "@/auth";
import Appbar from "@/components/Appbar";
import AnimatedLandingContent from "@/components/Landing/AnimatedLandingContent";

export default async function Page() {
  const session = await auth();
  const isAuthenticated = !!session?.user;

  return (
    <>
        <Appbar isAuthenticated={isAuthenticated} user={session?.user} />
        <AnimatedLandingContent isAuthenticated={isAuthenticated}/>
       </>
  );
}