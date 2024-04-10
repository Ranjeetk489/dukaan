import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import Config from "../src/config";
import { verifyAuth } from "./lib/auth";

export async function middleware(req: NextRequest) {
    let token = req.cookies?.get("token")?.value;
    const BASE_URL = 'http://localhost:3000';

    if (!token) {
        return NextResponse.redirect(BASE_URL + "/auth/login");
    }

    let verificationToken = await verifyAuth(token, Config.jwtSecret);

    if (req.nextUrl.pathname.startsWith(BASE_URL + "/auth/login") && !verificationToken) {
        return;
    }

    if (req.nextUrl.pathname.startsWith(BASE_URL + "/auth/login") && verificationToken) {
        return NextResponse.redirect(BASE_URL + "/products");
    }

    if (!verificationToken) {
        return NextResponse.redirect(BASE_URL + "/auth/login");
    }

    return NextResponse.next();
}

const config = {
    matcher: ["/products", "/auth/login"],
};

export { config };
