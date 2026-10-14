const assert = require("node:assert/strict")
const fs = require("node:fs")
const path = require("node:path")
const test = require("node:test")
const vm = require("node:vm")
const ts = require("typescript")

const root = path.resolve(__dirname, "..")
const baseUrl = "http://localhost:8000/api/v1"
const photoUrl = "/api/v1/records/photos/" + "a".repeat(32) + ".jpg"

function loadModule(filename, dependencies, globals = {}) {
  const source = fs.readFileSync(path.join(root, filename), "utf8")
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText
  const module = { exports: {} }
  const context = vm.createContext({
    module, exports: module.exports,
    require(name) {
      if (!(name in dependencies)) throw new Error(`Unexpected import: ${name}`)
      return dependencies[name]
    },
    console, URL, URLSearchParams, AbortController, Blob, Uint8Array, TextEncoder,
    setTimeout, clearTimeout, ...globals,
  })
  vm.runInContext(compiled, context, { filename })
  return module.exports
}

function createStorage(values = {}) {
  const valuesByKey = new Map(Object.entries(values))
  return {
    getItem: async key => valuesByKey.get(key) ?? null,
    setItem: async (key, value) => { valuesByKey.set(key, value) },
    valuesByKey,
  }
}

function loadRecords(storage, fetch, preparePhoto = async record => record) {
  return loadModule("app/utils/fetch/records/fetchRecords.ts", {
    "@/app/(tabs)/settings": { LanguageCode: { PL: "pl", EN: "en" } },
    "@react-native-async-storage/async-storage": storage,
    "@/app/utils/getBaseApiUrl": { getBaseApiUrl: () => baseUrl },
    "./recordPhoto": { prepareRecordPhotoForApi: preparePhoto },
  }, { fetch })
}

test("native photo is accepted by the installed Expo multipart converter", async () => {
  const bytes = new Uint8Array([255, 216, 255, 1, 2, 3])
  class File {
    constructor(uri) {
      this.uri = uri
      this.name = "photo.jpg"
      this.type = "image/jpeg"
      this.size = bytes.length
    }
    async bytes() { return bytes }
  }
  class NativeFormData {
    constructor() { this.parts = [] }
    append(name, value) { this.parts.push([name, value]) }
    entries() { return this.parts[Symbol.iterator]() }
  }
  const converter = loadModule("node_modules/expo/src/winter/fetch/convertFormData.ts", {
    "../../utils/blobUtils": { blobToArrayBufferAsync: blob => blob.arrayBuffer() },
  })
  const storage = createStorage()
  let uploads = 0
  const photos = loadModule("app/utils/fetch/records/recordPhoto.ts", {
    "@/app/utils/getBaseApiUrl": { getBaseApiUrl: () => baseUrl },
    "@react-native-async-storage/async-storage": storage,
    "expo-file-system": { File },
    "react-native": { Platform: { OS: "android" } },
  }, {
    FormData: NativeFormData,
    fetch: async (url, options) => {
      assert.equal(url, `${baseUrl}/records/photos`)
      const multipart = await converter.convertFormDataAsync(options.body)
      const body = Buffer.from(multipart.body)
      assert.ok(body.includes(Buffer.from(bytes)))
      assert.ok(body.includes(Buffer.from('filename="photo.jpg"')))
      uploads++
      return { ok: true, json: async () => ({ image_url: photoUrl }) }
    },
  })
  const record = { fishing_spot: "lake", image_url: "file:///temporary/photo.jpg" }
  assert.equal((await photos.prepareRecordPhotoForApi(record)).image_url, photoUrl)
  assert.equal((await photos.prepareRecordPhotoForApi(record)).image_url, photoUrl)
  assert.equal(uploads, 1)
})

test("failed photo upload does not create or edit a local record", async () => {
  const original = { id: 100, fish_name: "Carp", fishing_spot: "lake" }
  const serialized = JSON.stringify([original])
  const storage = createStorage({ catchRecords: serialized })
  const records = loadRecords(storage, async () => {
    throw new Error("Record API must not be called")
  }, async () => { throw new Error("photo-upload-error") })
  await assert.rejects(records.createRecord(original), /photo-upload-error/)
  await assert.rejects(records.updateRecord(100, original), /photo-upload-error/)
  assert.equal(storage.valuesByKey.get("catchRecords"), serialized)
})

test("local fallback saves a server photo URL, not a phone file URI", async () => {
  const storage = createStorage()
  const records = loadRecords(storage, async () => ({ ok: false }),
    async record => ({ ...record, image_url: photoUrl }))
  await records.createRecord({ fish_name: "Carp", fishing_spot: "lake", image_url: "file:///photo.jpg" })
  const saved = JSON.parse(storage.valuesByKey.get("catchRecords"))
  assert.equal(saved[0].image_url, photoUrl)
})

test("editing a local record creates it on the server and remembers its new ID", async () => {
  const localId = 1790934239677
  const original = { id: localId, fish_name: "Carp", fishing_spot: "lake" }
  const storage = createStorage({ catchRecords: JSON.stringify([original]) })
  const requests = []
  const records = loadRecords(storage, async (url, options) => {
    requests.push({ url, method: options.method, data: JSON.parse(options.body) })
    return { ok: true, json: async () => ({ ...JSON.parse(options.body), id: 12 }) }
  }, async record => ({ ...record, image_url: photoUrl }))
  const updated = { fish_name: "Carp", fishing_spot: "river", image_url: "file:///photo.jpg" }
  assert.equal((await records.fetchRecord(localId)).id, localId)
  assert.equal(requests.length, 0)
  assert.equal((await records.updateRecord(localId, updated)).id, 12)
  assert.equal(requests[0].method, "POST")
  assert.equal(requests[0].url, `${baseUrl}/records`)
  assert.equal(requests[0].data.image_url, photoUrl)
  assert.equal(JSON.parse(storage.valuesByKey.get("catchRecords")).length, 0)
  await records.updateRecord(localId, updated)
  assert.equal(requests[1].method, "PUT")
  assert.equal(requests[1].url, `${baseUrl}/records/12`)
})

test("a record remains editable using its old ID after background synchronization", async () => {
  const localId = 1790934239677
  const original = { id: localId, fish_name: "Carp", fishing_spot: "lake" }
  const storage = createStorage({ catchRecords: JSON.stringify([original]) })
  const serverRecord = { ...original, id: 15, image_url: photoUrl }
  const records = loadRecords(storage, async (url, options) => ({
    ok: true,
    json: async () => options?.method === "POST" ? serverRecord : [serverRecord],
  }), async record => ({ ...record, image_url: photoUrl }))
  await records.fetchRecords()
  assert.equal((await records.fetchRecord(localId)).id, 15)
})
