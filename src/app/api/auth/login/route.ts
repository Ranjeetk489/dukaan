import { rateLimitInstance } from '@/lib/redis';
import { directus, generateAndHashOtp } from '@/lib/utils';
import { readItem, updateItems } from '@directus/sdk';
import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/helpers';

export async function POST(req: Request) {
    const ip = req.headers.get('x-forwarded-for') || "no-ip";
    const rateLimit = await rateLimitInstance(5, '60s');
    const ratelimit = await rateLimit.limit(`${ip}-login`);
    
    const response = new NextResponse();
    response.headers.set('X-RateLimit-Limit', ratelimit.limit.toString());
    response.headers.set('X-RateLimit-Remaining', ratelimit.remaining.toString());
    response.headers.set('X-RateLimit-Reset', ratelimit.reset.toString());

    if (!ratelimit.success) {
        return new NextResponse('Too many requests', { status: 429 });
    }

    // check if email exists in the database
    const { email } = await req.json()
    if(email) {
        const isEmailExists = await directus.request(readItem('users', 'email', {
            filter: {
                email
            }
        }))
        if(isEmailExists) {
            const {otp, hashedOtp} = await generateAndHashOtp()
            await directus.request(updateItems("auth_request", ['created_at', 'updated_at', 'hashed_otp', 'email', 'status' , 'action'], {
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                hashed_otp: hashedOtp,
                email,
                status: 'pending',
                action: 'login'
            }))
            // mail the otp to the user
            const emailSent = await sendEmail(email, otp.toString());

            NextResponse.json({
                message: emailSent ? 'OTP sent to your email' : 'Failed to send OTP to your email'
            })
        }
    }
    

    return response; // Make sure to return a response for successful requests as well
}