import { NextApiRequest, NextApiResponse } from 'next';
import { verify } from 'jsonwebtoken';
import config from '../../../../src/config';
import { responseHelper } from '@/lib/helpers';

const secret = config.jwtSecret; 

const getTokenFromCookie = (req: NextApiRequest): string | null => {
    if (!req.headers.cookie) return null;

    const cookie = req.headers.cookie
        .split(';')
        .find((c) => c.trim().startsWith('token='));

    if (!cookie) return null;

    const token = cookie.split('=')[1];
    return token;
};

const tokenMiddleware = (handler: any) => async (req: NextApiRequest, res: NextApiResponse) => {
    const token = getTokenFromCookie(req);

    if (!token) {
        return responseHelper({ message: 'Unauthorized: No token provided' }, 401);
    }

    try {
        const decodedToken = verify(token, secret);
        return decodedToken;
    } catch (error) {
        return responseHelper({ message: 'Unauthorized: Invalid token' }, 401);
    }
};

export default tokenMiddleware;
