"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configuration = void 0;
const configuration = () => ({
    port: parseInt(process.env.PORT, 10) || 3000,
    database: {
        url: process.env.DATABASE_URL ||
            '',
    },
    jwt: {
        secret: process.env.JWT_SECRET || '',
        expiresIn: process.env.JWT_EXPIRES_IN || '90d',
    },
});
exports.configuration = configuration;
//# sourceMappingURL=config.js.map