const { createClient } = require("webdav");
const { createFileNodeFromBuffer } = require("gatsby-source-filesystem");
const mime = require("mime/lite");

const retry = async ({ callback, interval, retries }) => {
  try {
    return await callback();
  } catch (error) {
    console.log(error);
    if (retries) {
      await new Promise((resolve) => setTimeout(resolve, interval));
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
    glob = "/**/*.{png,jpg,gif,mp4,md}",
  } = pluginOptions;
  try {
    const directoryItems = await client.getDirectoryContents(sharePath, {
      deep: recursive,
      glob,
    });

    if (directoryItems.length === 0) {
      throw new Error("No webdav items found, aborting");
    }

    directoryItems.forEach((item) => {
      const nodeMeta = {
        id: createNodeId(item.filename),
        parent: null,
        children: [],
        internal: {
          type: "webdav",
          mediaType: item.mime,
          content: JSON.stringify(item), // Was interfering with Remark - wasn't really used anyway
          contentDigest: createContentDigest(item),
        },
      };

      const node = Object.assign({}, item, nodeMeta);
      createNode(node);
    });
  } catch (err) {
    console.error(err);
    console.error("Failed to fetch webdav items");
  }
};

exports.onCreateNode = async ({
  actions: { createNode, createParentChildLink },
  getCache,
  createNodeId,
  node,
}) => {
  if (node.internal.type === "webdav") {
    const associateFileNode = async () => {
      const buffer = await client.getFileContents(node.filename);

      // Necessary, otherwise Gatsby interpretes md files as binary and breaks Remark
      const ext = mime.getExtension(node.internal.mediaType);

      const name = node.basename.split(".")[0];
      const fileNode = await createFileNodeFromBuffer({
        buffer,
        name,
        getCache,
        createNode,
        createNodeId,
        parentNodeId: node.id,
        ext: !!ext ? `.${ext}` : undefined,
      });

      // Associate the webdev item with the actual content
      node.webDavContent___NODE = fileNode.id;

      createParentChildLink({ parent: node, child: fileNode });
    };

    return await retry({
      callback: associateFileNode,
      retries: 3,
      interval: 5000,
    });
  }
};
