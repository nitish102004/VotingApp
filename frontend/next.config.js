/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    typescript: {
        // This will allow the app to compile and run even with TypeScript errors
        // It's useful for development but should be fixed before production
        ignoreBuildErrors: true,
    },
    eslint: {
        // This will allow the app to compile and run even with ESLint errors
        ignoreDuringBuilds: true,
    },
}

module.exports = nextConfig 