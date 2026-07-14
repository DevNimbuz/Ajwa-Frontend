// next-sitemap.config.js
module.exports = {
  siteUrl: "https://flyajwa.com",
  generateRobotsTxt: true,
  exclude: [
    '/admin*',
    '/login*',
    '/register*',
    '/profile*',
    '/dashboard*',
    '/booking*',
    '/forgot-password*',
    '/reset-password*'
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/_next/",
          "/static/",
          "/admin",
          "/login",
          "/register",
          "/profile",
          "/dashboard",
          "/booking",
          "/forgot-password",
          "/reset-password"
        ],
      },
    ],
  },
};

