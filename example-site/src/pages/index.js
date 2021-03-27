import React from "react"
import { Link, graphql } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"

const IndexPage = ({ data }) => (
  <Layout>
    <SEO title="Home" />
    <h1>Listing your files:</h1>

    <ul>
      {data.allWebdav.nodes.map(item => (
        <li>
          <Link to={item.id}>{item.basename}</Link>
        </li>
      ))}
    </ul>

    <h2>Markdown Posts</h2>
    <ul>
      {data.allMarkdownRemark.nodes
        .filter(item => !!item.frontmatter.title) // No title, no index
        .map(item => (
          <li>
            <Link to={item.fields.slug}>{item.frontmatter.title}</Link>
          </li>
        ))}
    </ul>
  </Layout>
)

export default IndexPage

export const query = graphql`
  query {
    allWebdav {
      nodes {
        id
        basename
      }
    }
    allMarkdownRemark(
      filter: { parent: { parent: { internal: { type: { eq: "webdav" } } } } }
    ) {
      nodes {
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
