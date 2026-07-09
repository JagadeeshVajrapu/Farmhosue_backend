export declare const env: {
    readonly port: number;
    readonly nodeEnv: string;
    readonly isDev: boolean;
    readonly isProd: boolean;
    readonly mongodbUri: string;
    readonly jwt: {
        readonly secret: string;
        readonly expiresIn: string;
    };
    readonly cloudinary: {
        readonly cloudName: string;
        readonly apiKey: string;
        readonly apiSecret: string;
        readonly isConfigured: boolean;
    };
    readonly clientUrl: string;
    readonly smtp: {
        readonly host: string;
        readonly port: number;
        readonly user: string;
        readonly pass: string;
        readonly from: string;
        readonly adminEmail: string;
        readonly ownerEmail: string;
        readonly isConfigured: boolean;
    };
    readonly whatsapp: {
        readonly adminPhone: string;
        readonly webhookUrl: string;
    };
    readonly twilio: {
        readonly accountSid: string;
        readonly authToken: string;
        readonly whatsappFrom: string;
        readonly isConfigured: boolean;
    };
};
//# sourceMappingURL=env.d.ts.map