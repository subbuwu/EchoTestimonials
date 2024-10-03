import { auth } from "@/auth";
import Appbar from "@/components/Appbar";
import LandingHero from "@/components/LandingHero";

export default async function Page() {
  const session = await auth();
  const isAuthenticated = !!session?.user;


  return (
    <div>
      <Appbar isAuthenticated={isAuthenticated} user={session?.user} />
      <div className="flex justify-center w-full items-center mt-10">
        <LandingHero/>
      </div>
    </div>
  );
}