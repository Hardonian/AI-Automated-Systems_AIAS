export const env = {
    app: {
        siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://aiautomatedsystems.ca',
    },
    monitoring: {
        logLevel: 'info',
    }
};

export const getOptionalEnv = (key: string) => process.env[key];
