import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import Config from "../src/config";
import { verifyAuth } from "./lib/auth";

export async function middleware(req: NextRequest) {
    let token = req.cookies?.get("token")?.value;
    const BASE_URL = 'http://localhost:3000';

    if (!token) {
        return NextResponse.redirect(new URL("/auth/login", req.url))
    }

    // if (req.nextUrl.pathname.startsWith("/login") && !verificationToken) {
    //     return;
    // }

    // if (req.nextUrl.pathname.startsWith("/login") && verificationToken) {
    //     return NextResponse.redirect(new URL("/products", req.url))
    // }

    // if (!verificationToken) {
    //     return NextResponse.redirect(new URL("/login", req.url))
    // }

    return NextResponse.next();
}



export const config = {
    matcher: ['/cart'],
  };
