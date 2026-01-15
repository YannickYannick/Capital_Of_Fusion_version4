/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: ['localhost'],
    },
    experimental: {
        optimizePackageImports: ['three', '@react-three/fiber', '@react-three/drei'],
    },
};

export default nextConfig;
