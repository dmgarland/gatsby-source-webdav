# gatsby-source-webdav

A plugin for sourcing nodes from a WebDAV directory. Useful for generating static sites from a WebDAV share as a backend, such as Owncloud or Nextcloud.

This is a monorepo containing the plugin an example gatsby starter used to develop the app and serve as a reference.

```
example-site - gatsby starter that uses this plugin
gatsby-source-webdav - the actual plugin
```

Please check the version number before you decide to use this in production.

## How to use

1. Add the plugin to your `gatsby-config.js`, filling in your WebDAV settings.

```
    {
      resolve: require.resolve(`../gatsby-source-webdav`),
      options: {
        baseURL: "http://localhost:8080/remote.php/dav/files",
        credentials: {
          username: "admin",
          password: "password",
        },
        recursive: true,
        sharePath: "/admin",
      }
    }
```

If all goes well you should see `allWebDav` appear in your GraphQL browser. You ought to be then run a graphql query for the content. This example filters out any nodes missing associated content nodes.

```
export const query = graphql`
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
```

## Developing

There is a `docker-compose.yml` file that brings up a Nextcloud installation to use as a demo share. If desired you can login to the nextcloud instance on http://localhost:8080 using the following credentials:

```
Username: admin
Password: password
```

To see an example Gatsby site that uses the plugin, you can run the following:

> yarn workspace example-site 
> yarn workspace example-site develop

And visit http://localhost:8000. You should see a listing of the demo files provided by Nextcloud.
