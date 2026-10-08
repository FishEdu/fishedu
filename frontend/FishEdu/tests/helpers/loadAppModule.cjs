const fs = require("node:fs")
const path = require("node:path")
const vm = require("node:vm")
const ts = require("typescript")

function createModuleLoader(dependencies = {}, globals = {}) {
  const root = path.join(__dirname, "../..")
  const cache = new Map()
  const load = filename => {
    let absolute = path.resolve(root, filename)
    if (!fs.existsSync(absolute)) {
      absolute = [absolute + ".ts", absolute + ".tsx", path.join(absolute, "index.tsx")]
        .find(candidate => fs.existsSync(candidate))
    }
    if (!absolute) throw new Error(`Cannot resolve ${filename}`)
    if (cache.has(absolute)) return cache.get(absolute).exports
    const compiled = ts.transpileModule(fs.readFileSync(absolute, "utf8"), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX },
    }).outputText
    const module = { exports: {} }
    cache.set(absolute, module)
    vm.runInNewContext(compiled, {
      module, exports: module.exports, AbortController,
      require(name) {
        if (name in dependencies) return dependencies[name]
        if (name.startsWith("@/")) return load(name.slice(2))
        if (name.startsWith(".")) return load(path.relative(root, path.resolve(path.dirname(absolute), name)))
        throw new Error(`Unexpected import: ${name}`)
      },
      ...globals,
    }, { filename: absolute })
    return module.exports
  }
  return load
}

function expandNode(node) {
  if (Array.isArray(node)) return node.map(expandNode)
  if (!node || typeof node !== "object" || !node.props) return node
  if (typeof node.type === "function") return expandNode(node.type(node.props))
  return { ...node, props: { ...node.props, children: expandNode(node.props.children) } }
}

module.exports = { createModuleLoader, expandNode }
