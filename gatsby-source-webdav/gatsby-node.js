const { createClient } = require("webdav");
const { createFileNodeFromBuffer } = require("gatsby-source-filesystem");

const retry = async ({ callback, interval, retries }) => {
  try {
    return await callback();
  } catch (error) {
    console.log(error);
    if (retries) {
      await new Promise(resolve => setTimeout(resolve, interval));
      return retry({ callback, interval, retries: retries-- });
    } else {
      throw new Error(`Failed`);
    }
  }
};

var client;

exports.onPreInit = async (_, pluginOptions) => {
  const { baseURL, credentials } = pluginOptions;

  client = createClient(baseURL, credentials);
};

exports.sourceNodes = async function sourceNodes(
  { actions, createNodeId, createContentDigest },
  pluginOptions
) {
  const { createNode } = actions;
  const {
    sharePath,
    recursive,
    glob = "/**/*.{png,jpg,gif,mp4}"
  } = pluginOptions;
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

exports.onCreateNode = async ({
  actions: { createNode, createNodeField },
  getCache,
  createNodeId,
  node
}) => {
  if (node.internal.type === "webdav") {
    const associateFileNode = async () => {
      const buffer = await client.getFileContents(node.filename);
      console.log(`Fetched ${node.filename}`);
      const fileNode = await createFileNodeFromBuffer({
        buffer,
        name: node.basename.split(".")[0],
        getCache,
        createNode,
        createNodeId,
        parentNodeId: node.id
      });

      // Associate the webdev item with the actual content
      node.webDavContent___NODE = fileNode.id;
    };
    return await retry({
      callback: associateFileNode,
      retries: 3,
      interval: 5000
    });
  }
};
