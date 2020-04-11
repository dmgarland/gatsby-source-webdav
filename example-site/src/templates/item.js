import React from "react"
import Layout from "../components/layout"
import { Link } from "gatsby"

const ItemTemplate = ({ pageContext }) => {
  const {
    id,
    basename,
    filename,
    mime,
    size,
    type,
    etag,
    lastmod,
  } = pageContext

  return (
    <Layout>
      <h1>{basename}</h1>
      <dl>
        <dt>ID</dt>
        <dd>{id}</dd>

        <dt>Filename</dt>
        <dd>{filename}</dd>

        <dt>MIME</dt>
        <dd>{mime}</dd>

        <dt>Size</dt>
        <dd>{size}</dd>

        <dt>Last Modified</dt>
        <dd>{lastmod}</dd>

        <dt>Type</dt>
        <dd>{type}</dd>

        <dt>etag</dt>
        <dd dangerouslySetInnerHTML={{ __html: etag }} />
      </dl>

      <Link to="/">Back</Link>
    </Layout>
  )
}

export default ItemTemplate
