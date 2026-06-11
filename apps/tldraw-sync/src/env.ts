export interface Env {
  TLDRAW_DURABLE_OBJECT: DurableObjectNamespace;
  UPLOADS: R2Bucket;
  COLLAB_JWT_SECRET: string;
  ALLOWED_ORIGIN: string;
}
