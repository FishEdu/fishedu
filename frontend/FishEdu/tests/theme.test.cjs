const assert = require("node:assert/strict")
const fs = require("node:fs")
const path = require("node:path")
const test = require("node:test")
const vm = require("node:vm")
const ts = require("typescript")

function loadModule(filename, dependencies) {
  const source = fs.readFileSync(path.join(__dirname, "..", filename), "utf8")
  const compiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      jsx: ts.JsxEmit.ReactJSX,
    },
  }).outputText
  const module = { exports: {} }
  vm.runInNewContext(compiled, {
    module, exports: module.exports,
    require(name) {
      if (!(name in dependencies)) throw new Error(`Unexpected import: ${name}`)
      return dependencies[name]
    },
    console: { error() {} },
  }, { filename })
  return module.exports
}

function createProvider({ savedMode = Promise.resolve(null), save = async () => {} } = {}) {
  const colors = loadModule("app/constants/theme.ts", {})
  let state = "light"
  const ref = { current: false }
  let effects = []
  const nativeModes = []
  const { ThemeProvider } = loadModule("app/hooks/useTheme/ThemeProvider.tsx", {
    react: {
      useState: () => [state, next => { state = next }],
      useRef: () => ref,
      useEffect: effect => { effects.push(effect) },
    },
    "react/jsx-runtime": { jsx: (type, props) => ({ type, props }) },
    "react-native": { Appearance: { setColorScheme: mode => nativeModes.push(mode) } },
    "@react-native-async-storage/async-storage": {
      getItem: key => { assert.equal(key, "themeMode"); return savedMode },
      setItem: save,
    },
    "@/app/constants/theme": colors,
    "./ThemeContext": { ThemeContext: { Provider: "Provider" } },
  })
  const render = () => {
    effects = []
    return ThemeProvider({ children: null }).props.value
  }
  const initial = render()
  const cleanup = effects[0]()
  effects[1]()
  return {
    initial, render, cleanup, colors, nativeModes,
    applyNativeTheme: () => effects[1](),
  }
}

const flush = async () => { await Promise.resolve(); await Promise.resolve() }

test("saved dark theme restores the palette and native appearance", async () => {
  const provider = createProvider({ savedMode: Promise.resolve("dark") })
  await flush()
  const current = provider.render()
  assert.equal(current.mode, "dark")
  assert.equal(current.colors, provider.colors.darkColors)
  provider.applyNativeTheme()
  assert.deepEqual(provider.nativeModes, ["light", "dark"])
})

test("a late storage read does not override a user selection", async () => {
  let resolveSaved
  const savedMode = new Promise(resolve => { resolveSaved = resolve })
  const saved = []
  const provider = createProvider({ savedMode, save: async (...args) => saved.push(args) })
  await provider.initial.setMode("dark")
  resolveSaved("light")
  await flush()
  assert.equal(provider.render().mode, "dark")
  assert.deepEqual(saved, [["themeMode", "dark"]])
})

test("restoring the theme does not update an unmounted provider", async () => {
  let resolveSaved
  const provider = createProvider({ savedMode: new Promise(resolve => { resolveSaved = resolve }) })
  provider.cleanup()
  resolveSaved("dark")
  await flush()
  assert.equal(provider.render().mode, "light")
})

test("storage failure does not break the theme switch", async () => {
  const provider = createProvider({ save: async () => { throw new Error("storage unavailable") } })
  await assert.doesNotReject(provider.initial.setMode("dark"))
  await flush()
  assert.equal(provider.render().mode, "dark")
})
