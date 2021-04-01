const path = require("path")

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions
  const webdavItems = await graphql(davFilesQuery)

  webdavItems.data.allWebdav.nodes.forEach(node => {
    createPage({
      path: node.id,
      component: path.resolve("./src/templates/item.js"),
      context: node,
    })
  })

  const mdPosts = await graphql(mdPostsQuery)
  mdPosts.data.allMarkdownRemark.nodes.forEach(node => {
    createPage({
      path: node.fields.slug,
      component: path.resolve("./src/templates/blog.js"),
      context: node,
    })
  })
}

// Add a slug to our WebDav markdown files
exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions
  if (node.internal.type === `MarkdownRemark`) {
    if (!node.parent) {
      return
    }
    const fileNode = getNode(node.parent)
    if (!fileNode.parent) {
      return
    }

    const davNode = getNode(fileNode.parent)

    const namePath = path.parse(davNode.filename)

    const title = (node.frontmatter && node.frontmatter.title) || namePath.name

    createNodeField({
      node,
      name: `title`,
      value: title,
    })

    createNodeField({
      node,
      name: `slug`,
      value: `${namePath.dir}/${namePath.name}`.toLowerCase(),
    })
  }
}

const davFilesQuery = `
  query {
    allWebdav(
      sort: { fields: [lastmod], order: DESC }
      filter: { webDavContent: { id: { ne: null } } }
    ) {
      nodes {
        id
        filename
        basename
        mime
        size
        type
        etag
        lastmod
        webDavContent {
          publicURL
          childImageSharp {
            id
            fluid {
              src
              srcSet
              aspectRatio
              sizes
              base64
            }
          }
        }
      }
    }
  }
`

const mdPostsQuery = `
  query {
    allMarkdownRemark(
      filter: { parent: { parent: { internal: { type: { eq: "webdav" } } } } }
    ) {
      nodes {
        html
        fields {
          slug
        }
        excerpt
        frontmatter {
          title
        }
      }
    }
  }
`
