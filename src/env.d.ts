declare interface ImportMetaEnv {
  /**
   * Supabase project URL (VITE_ environment variable)
   * Example: https://xxxx.supabase.co
   */
  readonly VITE_SUPABASE_URL?: string;

  /**
   * Supabase anon/public key (VITE_ environment variable)
   */
  readonly VITE_SUPABASE_ANON_KEY?: string;

  /**
   * Add other VITE_* variables used in the project below, for example:
   * readonly VITE_SOME_KEY?: string;
   */

  // Allow arbitrary VITE_ prefixed env variables if you prefer:
  // [key: `VITE_${string}`]: string | undefined;
}

declare interface ImportMeta {
  readonly env: ImportMetaEnv;
}
