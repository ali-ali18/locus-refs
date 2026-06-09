export interface Env {
  TLDRAW_DURABLE_OBJECT: DurableObjectNamespace;
  TLDRAW_BUCKET: R2Bucket;
  COLLAB_JWT_SECRET: string;
  ALLOWED_ORIGIN: string;
}
