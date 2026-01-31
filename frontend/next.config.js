/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: ['localhost'],
    },
    experimental: {
        optimizePackageImports: ['three', '@react-three/fiber', '@react-three/drei'],
    },
    async headers() {
        return [
            {
                source: '/:path*.mp4',
                headers: [
                    {
                        key: 'Content-Type',
                        value: 'video/mp4',
                    },
                    {
                        key: 'Accept-Ranges',
                        value: 'bytes',
                    },
                ],
            },
        ];
    },
};

export default nextConfig;
