const select = require(`unist-util-select`)
const path = require(`path`)
const fs = require("fs-extra")

module.exports = (
  { markdownAST, markdownNode, getNode, pathPrefix, getNodesByType },
  pluginOptions
) => {
  const mdImageNodes = select(markdownAST, `image`, pathPrefix)
  if (!mdImageNodes || (mdImageNodes.length === 0) | !markdownNode.parent) {
    return markdownAST
  }

  // We need the markdown file relative path from the dav node
  const fileNode = getNode(markdownNode.parent)
  if (!fileNode || !fileNode.parent) {
    return markdownNode
  }
  const davNode = getNode(fileNode.parent)
  const dir = path.dirname(davNode.filename)
  const imgdir = davNode.basename.split(".")[0]

  mdImageNodes.forEach(item => {
    const ipath = path.join(dir, item.url)
    console.log("md img", ipath) // e.g. /Blog/writing-gatspy-plugins/README.md
    fileNodes = getNodesByType(`File`).map(fn => {
      if (!fn.parent) {
        return fn
      }
      const davNode = getNode(fn.parent)
      return {
        ...fn,
        davFilename: davNode.filename,
      }
    })

    const fNode = fileNodes.find(f => f.davFilename === ipath)
    if (fNode) {
      const dirPath = path
        .join(process.cwd(), "public", dir, imgdir)
        .toLowerCase()
      const dstPath = path
        .join(process.cwd(), "public", dir, imgdir, item.url)
        .toLowerCase()
      fs.ensureDirSync(dirPath)
      fs.copyFileSync(fNode.absolutePath, dstPath)
      console.log("imgnode", ipath, fNode.relativePath)
    }
  })
  return markdownAST
}
