import { directus, verifyOtp } from '@/lib/utils';
import { createItem, readItem, readItems, updateItem, updateItems } from '@directus/sdk';
import { NextResponse } from 'next/server';
import { jwtHelpers, responseHelper, sendEmail } from '@/lib/helpers';
import { cookies } from 'next/headers';
import config from '@/config';
import rateLimit from '@/lib/ratelimit';
import { AuthRequest } from '@/types/api';


const limiter = rateLimit({
    interval: 60 * 1000, // 60 seconds
    uniqueTokenPerInterval: 10, // Max 500 users per second
});

export async function POST(req: Request) {
    try {
        const ip = req.headers.get('x-forwarded-for') || "no-ip";
        const token = `${ip}-verify`
        const { remaining, limit } = await limiter.check(10, token)
        const { otp, email, first_name, last_name } = await req.json()
        //@ts-ignore
        const authRequest = await directus.request(readItems('auth_requests', {
            filter: {
                email: {
                    _eq: email
                },
                status: {
                    _eq: 'pending'
                }
            }
        }))
        const requestObj = authRequest[0] as AuthRequest
        const isVerified = await verifyOtp(otp, requestObj.hashed_otp)
        if(!isVerified) {
            return responseHelper({ message: 'Invalid OTP' }, 400, limit, remaining)
        }
        if (requestObj.action === 'login') {
            const isVerified = await verifyOtp(otp, requestObj.hashed_otp)
            if (isVerified) {
                //@ts-ignore
                const user = await directus.request(readItems('users', {
                    filter: { email: { _eq: email } }
                }));
                await directus.request(updateItem('auth_requests', requestObj.id, {
                    status: 'verified',
                    date_updated: new Date().toISOString()
                }))
                const token = jwtHelpers.createToken(user[0], config.jwtSecret, '1h')
                cookies().set('token', token, {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'strict',
                    path: '/'
                })
                return responseHelper({ message: 'OTP verified' }, 200, limit, remaining)   
            }
        } else {
            const isVerified = await verifyOtp(otp, requestObj.hashed_otp)
            if (isVerified) {
                await directus.request(updateItem('auth_requests', requestObj.id, {
                    status: 'verified',
                    date_updated: new Date().toISOString()
                }))
                const user = await directus.request(createItem('users', {
                    email,
                    first_name,
                    last_name,
                    date_created: new Date().toISOString(),
                    date_updated: new Date().toISOString()
                }))
                const token = jwtHelpers.createToken(user, config.jwtSecret, '1h')
                cookies().set('token', token, {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'strict',
                    path: '/'
                })
                return responseHelper({ message: 'OTP verified' }, 200, limit, remaining)
            }
        }
    } catch(error) {
        console.log(error)
        if((error as Error)?.message === "Rate limit exceeded") {
            return responseHelper({ message: 'Rate limit exceeded' }, 429)
        }
        return responseHelper({ message: 'Internal server error' }, 500)
    }

    // check if email exists in the database

}

