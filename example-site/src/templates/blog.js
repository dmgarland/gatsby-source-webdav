import React from "react"
import Layout from "../components/layout"
import { Link } from "gatsby"
import Img from "gatsby-image"

const ItemTemplate = ({ pageContext }) => {
  console.log("page context", pageContext)
  const { frontmatter, html } = pageContext

  return (
    <Layout>
      <h1>{frontmatter.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: html }} />

      <Link to="/">Back</Link>
    </Layout>
  )
}

export default ItemTemplate
