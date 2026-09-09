export type NodeEnvironment = 'development' | 'test' | 'staging' | 'production';

export interface AppConfiguration {
  environment: NodeEnvironment;
  port: number;
  corsOrigins: string[];
  rateLimit: {
    ttlMs: number;
    limit: number;
  };
  logging: {
    level: string;
  };
  database: {
    uri: string;
    maxPoolSize: number;
    minPoolSize: number;
    serverSelectionTimeoutMs: number;
    connectTimeoutMs: number;
    socketTimeoutMs: number;
  };
}
