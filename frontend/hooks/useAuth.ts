
import { config } from "@/config";
import { useAuth, useUser } from "@clerk/nextjs";


function useRegisterUserWithBackend() {
  const { user } = useUser();      // Get current Clerk user
  const { getToken } = useAuth();  // Clerk session token fetcher

  const registerUserWithBackend = async () => {
    if (!user) return; // Optionally handle if not signed in

    const token = await getToken();

    // Send user data to backend
    await fetch(`${config.backendAuthUrl}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}` // Pass Clerk token to backend for verification
      },
      body: JSON.stringify({
        clerkId: user.id,
        email: user.primaryEmailAddress?.emailAddress,
        firstName: user.firstName,
        lastName: user.lastName,
        imageUrl : user.imageUrl,
        // Add more fields as needed
      })
    });
  };

  return registerUserWithBackend;
}

export default useRegisterUserWithBackend;