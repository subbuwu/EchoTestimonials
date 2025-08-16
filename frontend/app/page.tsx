import Appbar from "@/components/Appbar";
import AnimatedLandingContent from "@/components/Landing/AnimatedLandingContent";
import { auth } from "@clerk/nextjs/server";

export default async function Page() {
  const { userId } = await auth()
  
  return (
    <>
      <Appbar isAuthenticated={!!userId} />
      <AnimatedLandingContent isAuthenticated={!!userId} />
    </>
  );
}