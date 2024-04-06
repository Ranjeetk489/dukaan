import { ConfigProps } from "@/types";

const config: ConfigProps = {
    domainName: process.env.NEXT_PUBLIC_DOMAIN_NAME!,
    appName: process.env.NEXT_PUBLIC_APP_NAME!,
    redis: {
        host: process.env.REDIS_HOST!,
        port: parseInt(process.env.REDIS_PORT!),
        password: process.env.REDIS_PASSWORD!,
    },
}

export default config

