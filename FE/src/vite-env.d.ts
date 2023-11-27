/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_NEST_API_URL: string;
  readonly VITE_GITHUB_OAUTH_URL: string;
  readonly VITE_GITHUB_CLIENT_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
