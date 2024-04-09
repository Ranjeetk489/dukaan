import { directus } from '@/lib/utils';
export interface ConfigProps {
    domainName: string;
    appName: string;
    jwtSecret: string;
    directusDomain: string;
    directusFileDomain: string;
    redis: {
        host: string;
        port: number;
        password: string;
    };
    email: {
        admin: string;
        adminPwd: string;
    }
}

