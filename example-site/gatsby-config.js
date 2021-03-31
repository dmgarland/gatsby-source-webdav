module.exports = {
  siteMetadata: {
    title: `WebDAV Example`,
    description: `The Gatsby default starter using the webDAV plugin to generate pages for each item in Nextcloud`,
    author: `Dan Garland`,
  },
  plugins: [
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [`gatsby-remark-images`, `gatsby-remark-webdav`],
      },
    },
    {
      resolve: require.resolve(`../gatsby-source-webdav`),
      options: {
        baseURL: "http://localhost:8080/remote.php/dav/files/admin/Documents",
        credentials: {
          username: "admin",
          password: "admin",
        },
        recursive: true,
        glob: "**/*.{md,png,jpg,jpeg}",
        sharePath: "/",
      },
    },
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `gatsby-starter-default`,
        short_name: `starter`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/images/gatsby-icon.png`, // This path is relative to the root of the site.
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
  ],
}
