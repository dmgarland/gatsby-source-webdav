const { createFilePath } = require(`gatsby-source-filesystem`)
const path = require("path")

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions
  const webdavItems = await graphql(`
    query {
      allWebdav {
        nodes {
          id
          filename
          basename
          mime
          size
          type
          etag
          lastmod
        }
      }
    }
  `)

  webdavItems.data.allWebdav.nodes.forEach(node => {
    createPage({
      path: node.id,
      component: path.resolve("./src/templates/item.js"),
      context: node,
    })
  })
}