/// <reference types="vite/client" />

// Declares the app's custom Vite env variable(s) for type-checked `import.meta.env` access.
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
