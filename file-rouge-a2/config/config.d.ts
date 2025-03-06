interface DatabaseConfig {
    url: string;
}
interface JwtConfig {
    secret: string;
    expiresIn: string;
}
interface Config {
    port: number;
    database: DatabaseConfig;
    jwt: JwtConfig;
}
export declare const configuration: () => Config;
export {};
