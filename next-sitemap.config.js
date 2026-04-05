// next-sitemap.config.js
module.exports = {
  siteUrl: "https://flyajwa.com",
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/", "/static/"],
      },
    ],
  },
};
