import { auth } from "@/auth";

export default async function UserAvatar() {
  const session = await auth();  

  if (!session?.user) {
    return null; 
  }

  return (
    <div>
      <img
        src={session.user.image ?? ''} 
        className="rounded-full h-[4rem] w-[4rem]"
        alt="User Avatar"
      />
    </div>
  );
}
