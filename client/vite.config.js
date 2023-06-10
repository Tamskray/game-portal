import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    "process.env": {
      REACT_APP_API_URL: "http://localhost:5000/api",
      REACT_APP_URL: "http://localhost:5000/",
    },
  },
});
