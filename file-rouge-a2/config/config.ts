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
  
  export const configuration = () => ({
    database: {
      url: process.env.DATABASE_URL,  
    },
    jwt: {
      secret: process.env.JWT_SECRET, 
      expiresIn: process.env.JWT_EXPIRES_IN, 
    },
  });
  