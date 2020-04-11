import React from "react"
import { Link, graphql } from "gatsby"

import Layout from "../components/layout"
import Image from "../components/image"
import SEO from "../components/seo"

const IndexPage = ({ data }) => {
  console.log(data)
  return (
    <Layout>
      <SEO title="Home" />
      <h1>Listing your files:</h1>

      <ul>
        {data.allWebdav.nodes.map(item => {
          return (
            <li>
              <Link to={item.id}>{item.basename}</Link>
            </li>
          )
        })}
      </ul>
    </Layout>
  )
}

export default IndexPage

export const query = graphql`
  query {
    allWebdav {
      nodes {
        id
        basename
      }
    }
  }
`
