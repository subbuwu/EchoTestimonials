import { api } from "@/lib/axios"

export const getUserDashboradSpaces = async( { userId , email,accessToken} : { userId : string , email : string,accessToken: string} ) => {
    try {
        const res = await api.get(`/users/spaces`, {
            params : {
                email,
                userId
            },
            headers: {
                 Authorization: `Bearer ${accessToken}`,
            },
        });
        
        return res.data;
    } catch (error) {
        console.log('api error',error)
    }
}