export interface ConfigProps {
    domainName: string;
    appName: string;
    jwtSecret: string;
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

