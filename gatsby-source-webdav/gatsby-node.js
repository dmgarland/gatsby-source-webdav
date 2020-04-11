const { createClient } = require("webdav");

exports.sourceNodes = async function sourceNodes(
  { actions, createNodeId, createContentDigest },
  pluginOptions
) {
  const { createNode } = actions;
  const {
    baseURL,
    credentials,
    sharePath,
    recursive,
    glob = "/**/*.{png,jpg,gif,mp4}"
  } = pluginOptions;

  const client = createClient(baseURL, credentials);

  const directoryItems = await client.getDirectoryContents(sharePath, {
    deep: recursive,
    glob
  });

  directoryItems.forEach(item => {
    const nodeMeta = {
      id: createNodeId(item.filename),
      parent: null,
      children: [],
      internal: {
        type: "webdav",
        mediaType: item.mime,
        content: JSON.stringify(item),
        contentDigest: createContentDigest(item)
      }
    };

    const node = Object.assign({}, item, nodeMeta);
    createNode(node);
  });
};
