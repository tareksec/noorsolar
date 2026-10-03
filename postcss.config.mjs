// Explicitly configure PostCSS with proper worker settings and increase Node worker thread limits
if (typeof process !== "undefined" && process.env) {
  process.env.UV_THREADPOOL_SIZE = process.env.UV_THREADPOOL_SIZE || "128";
  if (process.setMaxListeners) {
    process.setMaxListeners(50);
  }
}

/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
