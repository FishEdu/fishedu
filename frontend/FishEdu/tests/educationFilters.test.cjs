const assert = require("node:assert/strict")
const fs = require("node:fs")
const path = require("node:path")
const test = require("node:test")
const vm = require("node:vm")
const ts = require("typescript")

const filters = { language: "pl", type: "all", level: "all", search: "" }
const materials = [
  { id: 1, type: "pdf", levels: ["beginner"] },
  { id: 2, type: "video", levels: ["beginner"] },
  { id: 3, type: "quiz", levels: ["beginner", "advanced"] },
  { id: 4, type: "pdf", levels: ["advanced"] },
]

function createHook(fetchImplementation) {
  let state
  let dependencies
  let cleanup
  let timerId = 0
  const timers = new Map()
  const requests = []
  const updates = []
  const source = fs.readFileSync(path.join(__dirname, "../app/hooks/useFetchEducationMaterials/useFetchEducationMaterials.ts"), "utf8")
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText
  const module = { exports: {} }
  const imports = {
    "@/app/utils/getBaseApiUrl": { getBaseApiUrl: () => "http://backend/api/v1" },
    react: {
      useState(initial) {
        state ??= initial
        return [state, next => { state = next; updates.push(next) }]
      },
      useEffect(effect, nextDependencies) {
        if (!dependencies || nextDependencies.some((value, index) => value !== dependencies[index])) {
          cleanup?.()
          dependencies = nextDependencies
          cleanup = effect()
        }
      },
    },
  }
  vm.runInNewContext(compiled, {
    module, exports: module.exports, URLSearchParams, AbortController,
    require(name) {
      if (!(name in imports)) throw new Error(`Unexpected import: ${name}`)
      return imports[name]
    },
    setTimeout(callback, delay) {
      assert.equal(delay, 250)
      timers.set(++timerId, callback)
      return timerId
    },
    clearTimeout(id) { timers.delete(id) },
    fetch: async (url, options) => {
      requests.push({ url, options })
      if (fetchImplementation) return fetchImplementation(url, options)
      const params = new URL(url).searchParams
      const data = materials.filter(material =>
        (!params.has("type") || material.type === params.get("type")) &&
        (!params.has("level") || material.levels.includes(params.get("level")))
      )
      return { ok: true, json: async () => data }
    },
  })
  return {
    render: selected => module.exports.useFetchEducationMaterials(selected),
    runTimer() {
      const [id, callback] = timers.entries().next().value
      timers.delete(id)
      return callback()
    },
    unmount: () => cleanup?.(),
    requests, updates,
  }
}

const ids = result => Array.from(result.data, material => material.id)

test("all types and all levels are omitted from the request", async () => {
  const hook = createHook()
  hook.render(filters)
  await hook.runTimer()
  const params = new URL(hook.requests[0].url).searchParams
  assert.equal(params.get("language"), "pl")
  assert.equal(params.has("type"), false)
  assert.equal(params.has("material_type"), false)
  assert.equal(params.has("level"), false)
  assert.deepEqual(ids(hook.render(filters)), [1, 2, 3, 4])
})

test("material type uses the backend's type parameter", async () => {
  const selected = { ...filters, type: "quiz", level: "advanced", search: "  ryba & jezioro  " }
  const hook = createHook()
  hook.render(selected)
  await hook.runTimer()
  const params = new URL(hook.requests[0].url).searchParams
  assert.equal(params.get("type"), "quiz")
  assert.equal(params.has("material_type"), false)
  assert.equal(params.get("level"), "advanced")
  assert.equal(params.get("query"), "ryba & jezioro")
  assert.deepEqual(ids(hook.render(selected)), [3])
})

test("deselecting beginner removes the level restriction and shows all materials", async () => {
  const hook = createHook()
  const beginner = { ...filters, level: "beginner" }
  hook.render(beginner)
  await hook.runTimer()
  assert.deepEqual(ids(hook.render(beginner)), [1, 2, 3])
  assert.equal(hook.render(filters).loading, true)
  await hook.runTimer()
  assert.equal(new URL(hook.requests[1].url).searchParams.has("level"), false)
  assert.deepEqual(ids(hook.render(filters)), [1, 2, 3, 4])
})

test("switching to quizzes immediately hides results from the previous tab", async () => {
  const hook = createHook()
  hook.render(filters)
  await hook.runTimer()
  const quizzes = { ...filters, type: "quiz" }
  const pending = hook.render(quizzes)
  assert.deepEqual(ids(pending), [])
  assert.equal(pending.loading, true)
  await hook.runTimer()
  assert.deepEqual(ids(hook.render(quizzes)), [3])
  assert.equal(hook.render(quizzes).loading, false)
})

test("a delayed old response cannot overwrite a newer filter result", async () => {
  let resolveOldResponse
  const oldResponse = new Promise(resolve => { resolveOldResponse = resolve })
  const hook = createHook(url => new URL(url).searchParams.get("type") === "quiz"
    ? Promise.resolve({ ok: true, json: async () => [materials[2]] })
    : oldResponse
  )
  hook.render(filters)
  const oldRequest = hook.runTimer()
  const quizzes = { ...filters, type: "quiz" }
  hook.render(quizzes)
  await hook.runTimer()
  resolveOldResponse({ ok: true, json: async () => materials })
  await oldRequest
  assert.equal(hook.requests[0].options.signal.aborted, true)
  assert.deepEqual(ids(hook.render(quizzes)), [3])
})

test("late failures and responses cannot update an unmounted hook", async () => {
  let rejectResponse
  const hook = createHook(() => new Promise((resolve, reject) => { rejectResponse = reject }))
  hook.render(filters)
  const request = hook.runTimer()
  hook.unmount()
  const updateCount = hook.updates.length
  rejectResponse(new Error("Connection lost"))
  await request
  assert.equal(hook.updates.length, updateCount)
})

test("an API error is reported only for the current request", async () => {
  const hook = createHook(async () => ({ ok: false }))
  hook.render(filters)
  await hook.runTimer()
  assert.equal(hook.render(filters).error, true)
  assert.equal(hook.render(filters).loading, false)
  const pending = hook.render({ ...filters, type: "quiz" })
  assert.equal(pending.error, false)
  assert.equal(pending.loading, true)
})
