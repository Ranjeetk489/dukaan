import config from "@/config";
// since jwtverify dosent work on edge. Here jose npm package is used
import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { responseHelper } from "./helpers";
import { NextResponse } from "next/server";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

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


type AuthData = {
    isAuthenticated: boolean;
    user?: AuthUser | null
}

export type AuthUser =  {
    id: number;
    username: string;
    email: string;
    password_hash: null;
    created_at: string;
    last_login: null;
    updated_at: Date;
    iat: Date;
    exp: Date;
} 



export const isAuthenticatedAndUserData = async():Promise<AuthData> => {
    try {
    const cookieStore = cookies()
    const token = cookieStore.get('token');
    if (token) {
        let verified = await jwtVerify(token.value, new TextEncoder().encode(config.jwtSecret));
        const userData = verified.payload as unknown as AuthData['user'];
        return {
            isAuthenticated: true,
            user: userData 
        }
    } else {
        return {
            isAuthenticated: false,
            user: null
        }
    }
    } catch (error) {
        console.error("error in readTokenFromCookies", error);
        return {
            isAuthenticated: false,
            user: null
        }
    }
}