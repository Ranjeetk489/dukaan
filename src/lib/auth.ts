// since jwtverify dosent work on edge. Here jose npm package is used
import { jwtVerify, SignJWT } from "jose";

export const verifyAuth = async (token: string, secret: string) => {
    try {
        let verified = await jwtVerify(token, new TextEncoder().encode(secret));
        const { exp, ...payload } = verified.payload;

        if (exp && Date.now() >= exp * 1000) {
            console.error('Token has expired');
            return null;
        }

        return verified.payload;
    } catch (error) {
        console.error("error in verifyAuth", error);
        return null;
    }
}
