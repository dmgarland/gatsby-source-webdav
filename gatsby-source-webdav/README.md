## Gatsby-Source-Webdav

This source package creates Gatsby nodes for images and videos mounted on a WebDAV share, for use in your static website. This might be useful if you want to publish WebDAV content for instance from your Nextcloud server.

*N.B.* Check the version number before you decide to use this in your production app.

### Dependencies

This ought to work out of the box with any gatsby website.

### Learning Resources 

TODO

## How to install

> npm --save gatsby-source-webdav

Then, add the plugin to your `gatsby-config.js`

```
plugins: [
  {
    resolve: `gatsby-source-webdav`,
    options: {
      baseURL: "https://yourdomain/webdav",
      credentials: {
        username: "username",
        password: "password",
      },
      recursive: true,
      sharePath: "/",
    },
  }
]
```
    
## Available options

baseURL - the URL to your WebDAV server
credentials - username/password (optional)
recursive - should we source files in subdirectories of the WebDAV share? true / false
sharePath - what path under the WebDav share should we use?

## Using

If you've configured the plugin correctly, you ought to be able to query for your WebDAV nodes in GraphQL.

```graphql
query {
      allWebdav(sort: { fields: [lastmod], order: DESC }) {
        edges {
          node {
            basename
            filename
            id
            lastmod
            mime
            size
            type
            webDavContent {
              publicURL
              childImageSharp {
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
    }
```

Images will have entries populated in `childImageSharp`, so you can make use of `gatsby-image` features, whereas the videos will just have a `publicURL`. Use the `type` field to determine what kind of file is being returned.

See the example site on GitHub for an example of how to use with a sample `gatsby-node.js`

## When do I use this plugin?

* If you want to make static websites using assets from a WebDAV share

## How to run tests

TODO

## How to develop locally

Checkout the monorepo from Github and then to see an example Gatsby site that uses the plugin, you can run the following:

> yarn workspace example-site 
> yarn workspace example-site develop

And visit http://localhost:8000 

## How to contribute

Send me a PR!
