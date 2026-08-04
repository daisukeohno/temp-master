/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_FILE_FALLBACK_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
