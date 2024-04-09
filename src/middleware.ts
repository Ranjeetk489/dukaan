import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import Config from "../src/config";
import { verifyAuth } from "./lib/auth";

export async function middleware(req: NextRequest) {

    let token = req.cookies?.get("token")?.value;

    if (!token) {
        return NextResponse.redirect(new URL("/login", req.url))
    }
    let verificationToken = await verifyAuth(token, Config.jwtSecret)
    // console.log(verificationToken, "verificationToken", req.nextUrl.pathname)

    if (req.nextUrl.pathname.startsWith("/login") && !verificationToken) {
        return;
    }

    if (req.nextUrl.pathname.startsWith("/login") && verificationToken) {
        return NextResponse.redirect(new URL("/products", req.url))
    }

    if (!verificationToken) {
        return NextResponse.redirect(new URL("/login", req.url))
    }

    return NextResponse.next()
}



const config = {
    matcher: ["/", "/products", "/login"],
};

export { config };
