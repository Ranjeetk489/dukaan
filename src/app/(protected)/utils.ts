
import { fetchInsideTryCatch } from "@/lib/client/apiUtil"

const isAuthenticatedAndUserId = async () => {
    const response = await fetchInsideTryCatch<string>('api/auth/verify')
        
    if (response && response.response.statusCode === 200 && response.response.data) {
        return {
            isAuthenticated: true,
            userData: response.response.data
        }
      }
    return {
        isAuthenticated: false
    }
}


 export default isAuthenticatedAndUserId
