const { GraphQLString } = require("gatsby/graphql");
const fs = require("fs-extra");
const path = require("path");

module.exports = (
  { type, getNodeAndSavePathDependency, getNode, pathPrefix = "" },
  pluginOptions
) => {
  if (type.name !== "File") {
    return {};
  }

  return {
    davFilename: {
      type: GraphQLString,
      args: {},
      description: "Original webdav filename. Used to map relative links.",
      resolve: (file, fieldArgs, context) => {
        if (!file.parent) {
          return;
        }
        const davNode = getNode(file.parent);

        return davNode.filename;
      },
    },
  };
};
