export interface Env {
  DB?: D1Database;
  MEDIA?: R2Bucket;
  ASSETS?: Fetcher;
  ENVIRONMENT?: string;
  ADMIN_PASSCODE?: string;
}