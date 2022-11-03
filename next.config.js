/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
};

module.exports = nextConfig;
// module.exports = () => {
//     const rewrites = () => {
//         return [
//             {
//                 source: "/token",
//                 destination: "http://localhost:8081",
//             },
//         ];
//     };
//     return {
//         rewrites,
//     };
// };
