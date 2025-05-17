import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Set the base path if you are deploying to a subfolder.
  // For example, if your app is at "https://example.com/my-qr-app/",
  // then base should be "/my-qr-app/".
  // If deploying to GitHub Pages for a repository named "my-qr-app",
  // it would also be "/my-qr-app/".
  // If deploying to the root (e.g., "https://example.com/"), you can omit base or set it to '/'.
  base: '/your-repository-name/', // <-- IMPORTANT: Change this to your actual subfolder/repo name
})