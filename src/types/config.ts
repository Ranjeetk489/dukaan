export interface ConfigProps {
    domainName: string;
    appName: string;
    redis: {
        host: string;
        port: number;
        password: string;
    };
}