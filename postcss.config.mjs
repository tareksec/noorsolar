/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    "@tailwindcss/postcss": {
      optimize: process.env.NODE_ENV === "production",
    },
  },
  // PostCSS processing memory & worker optimization
  options: {
    map: false,
    workers: 1,
  },
};

export default config;
