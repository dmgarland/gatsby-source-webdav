const { createClient } = require("webdav");

exports.sourceNodes = async function sourceNodes({
  actions,
  createNodeId,
  createContentDigest
}) {
  const { createNode } = actions;

  const client = createClient("http://localhost:8080/remote.php/dav/files", {
    username: "admin",
    password: "password"
  });

  const directoryItems = await client.getDirectoryContents("/admin", {
    deep: true,
    glob: "/**/*.{png,jpg,gif,mp4}"
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
