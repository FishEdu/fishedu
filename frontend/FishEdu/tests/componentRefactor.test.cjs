const assert = require("node:assert/strict")
const test = require("node:test")
const { createModuleLoader, expandNode } = require("./helpers/loadAppModule.cjs")

const normalize = value => JSON.parse(JSON.stringify(value))
const flush = () => new Promise(resolve => setImmediate(resolve))
const jsx = (type, props) => ({ type, props })

function findNodes(node, predicate) {
  if (Array.isArray(node)) return node.flatMap(child => findNodes(child, predicate))
  if (!node || typeof node !== "object") return []
  return [...(predicate(node) ? [node] : []), ...findNodes(node.props?.children, predicate)]
}

function createApp({ dependencies = {}, globals = {}, dark = false } = {}) {
  const slots = []
  let cursor = 0
  let pending = []
  const requests = []
  const colorsModule = createModuleLoader()("app/constants/theme.ts")
  const colors = dark ? colorsModule.darkColors : colorsModule.lightColors
  const native = Object.fromEntries([
    "ActivityIndicator", "FlatList", "Image", "Pressable", "ScrollView", "Switch", "Text", "TextInput", "View",
  ].map(name => [name, name]))
  const react = {
    useState(initial) {
      const index = cursor++
      if (!(index in slots)) slots[index] = typeof initial === "function" ? initial() : initial
      return [slots[index], value => { slots[index] = typeof value === "function" ? value(slots[index]) : value }]
    },
    useEffect(callback, deps) {
      const index = cursor++
      const previous = slots[index]
      if (!previous || deps.some((value, i) => value !== previous.deps[i])) {
        previous?.cleanup?.()
        const effect = { deps }
        slots[index] = effect
        pending.push(() => { effect.cleanup = callback() })
      }
    },
  }
  const load = createModuleLoader({
    react,
    "react/jsx-runtime": { jsx, jsxs: jsx, Fragment: "Fragment" },
    "react-native": { ...native, StyleSheet: { create: styles => styles }, Linking: { openURL: url => requests.push(url) } },
    "expo-router": { router: { push: href => requests.push(href), back: () => requests.push("back") }, useLocalSearchParams: () => ({}) },
    "@expo/vector-icons/Ionicons": "Ionicons",
    "@/app/components/ui/Container": "Container",
    "@/app/hooks/useTheme/useTheme": { useTheme: () => ({ colors }) },
    "@/app/hooks/useLanguage/useLanguage": { useLanguage: () => ({ language: "pl", languageCode: "pl" }) },
    "@/app/hooks/useEducationFavorites/useEducationFavorites": { useEducationFavorites: () => ({ favoriteIds: [], toggleFavorite() {} }) },
    "@/app/utils/translation/getTranslation": { getTranslation: key => key },
    "@/app/utils/getBaseApiUrl": { getBaseApiUrl: () => "http://backend/api/v1" },
    ...dependencies,
  }, globals)
  const render = callback => {
    cursor = 0
    pending = []
    const result = callback()
    for (const effect of pending) effect()
    return result
  }
  return {
    colors, load, requests, render,
    screen: (Component, props = {}) => render(() => expandNode(Component(props))),
    unmount: () => { for (const slot of slots) slot?.cleanup?.() },
  }
}

const material = {
  id: 42, type: "pdf", title: "Sample material", description: "Description",
  image_url: null, file_name: "sample.pdf", duration_minutes: null, levels: ["beginner"],
}

test("education screen composes filters and preserves deselection behavior", () => {
  let filters
  const app = createApp({ dependencies: {
    "@/app/hooks/useFetchEducationMaterials/useFetchEducationMaterials": {
      useFetchEducationMaterials: value => { filters = value; return { data: [material], loading: false, error: false } },
    },
  } })
  const Screen = app.load("app/(tabs)/education/index.tsx").default
  const getButtons = tree => findNodes(tree, node => node.type === "Pressable")
  let tree = app.screen(Screen)
  assert.equal(filters.level, "beginner")
  getButtons(tree).find(button => findNodes(button, node => node.type === "Text" && node.props.children === "education.level.beginner").length).props.onPress()
  tree = app.screen(Screen)
  assert.equal(filters.level, "all")
  getButtons(tree).find(button => findNodes(button, node => node.type === "Text" && node.props.children === "education.tab.quiz").length).props.onPress()
  tree = app.screen(Screen)
  assert.equal(filters.type, "quiz")
  getButtons(tree).find(button => findNodes(button, node => node.type === "Text" && node.props.children === "education.tab.quiz").length).props.onPress()
  app.screen(Screen)
  assert.equal(filters.type, "all")
})

for (const dark of [false, true]) {
  test(`education search keeps input value and themed colors in ${dark ? "dark" : "light"} mode`, () => {
    const app = createApp({ dark })
    const Search = app.load("app/components/Education/EducationSearchInput.tsx").default
    let changed
    const input = findNodes(app.screen(Search, { value: "fish", onChangeText: value => { changed = value } }), node => node.type === "TextInput")[0]
    assert.equal(input.props.value, "fish")
    assert.equal(input.props.style.color, app.colors.text.main)
    assert.equal(input.props.placeholderTextColor, app.colors.text.muted)
    input.props.onChangeText("carp")
    assert.equal(changed, "carp")
  })
}

test("material header alone owns the favorite action", () => {
  let favoriteIds = []
  const app = createApp({ dependencies: {
    "@/app/hooks/useEducationFavorites/useEducationFavorites": { useEducationFavorites: () => ({
      favoriteIds, toggleFavorite: id => { favoriteIds = favoriteIds.includes(id) ? [] : [id] },
    }) },
  } })
  const Header = app.load("app/components/Education/EducationMaterialHeader.tsx").default
  let tree = app.screen(Header, { material })
  const favorite = () => findNodes(tree, node => node.type === "Pressable")[0]
  assert.equal(favorite().props.accessibilityLabel, "education.favorite.add")
  favorite().props.onPress()
  tree = app.screen(Header, { material })
  assert.equal(favorite().props.accessibilityLabel, "education.favorite.remove")
  assert.equal(findNodes(tree, node => node.type === "Ionicons")[0].props.name, "star")
  favorite().props.onPress()
  tree = app.screen(Header, { material })
  assert.equal(favorite().props.accessibilityLabel, "education.favorite.add")
})

test("favorite indicator on a material card stays small and non-interactive", () => {
  const app = createApp()
  const Card = app.load("app/components/Education/EducationMaterialCard.tsx").default
  const tree = app.screen(Card, { material, typeLabel: "PDF", isFavorite: true, onPress() {} })
  const indicator = findNodes(tree, node => node.props?.pointerEvents === "none")[0]
  assert.ok(indicator)
  assert.equal(findNodes(indicator, node => node.type === "Ionicons")[0].props.size, 16)
  assert.equal(findNodes(tree, node => node.type === "Pressable").length, 1)
})

for (const type of ["pdf", "video", "quiz"]) {
  test(`material action still opens the ${type} route`, () => {
    const app = createApp()
    const Actions = app.load("app/components/Education/EducationMaterialActions.tsx").default
    const quiz = type === "quiz" ? { id: 1, passing_score: 67, questions: [] } : null
    const tree = app.screen(Actions, { material: { ...material, type, quiz } })
    findNodes(tree, node => node.type === "Pressable")[0].props.onPress()
    assert.equal(app.requests[0].pathname, `/(tabs)/education/${type}`)
    assert.equal(app.requests[0].params.id, "42")
    if (type !== "quiz") assert.equal(app.requests[0].params.url, "sample.pdf")
  })
}

test("material fetch ignores stale responses when the selected material changes", async () => {
  const pending = []
  const app = createApp({ globals: { fetch: (url, options) => new Promise(resolve => pending.push({ url, options, resolve })) } })
  const useMaterial = app.load("app/hooks/useFetchEducationMaterial/useFetchEducationMaterial.ts").useFetchEducationMaterial
  app.render(() => useMaterial("42", "pl"))
  app.render(() => useMaterial("43", "en"))
  assert.equal(pending[0].options.signal.aborted, true)
  pending[1].resolve({ ok: true, json: async () => ({ ...material, id: 43 }) })
  await flush()
  pending[0].resolve({ ok: true, json: async () => material })
  await flush()
  const state = app.render(() => useMaterial("43", "en"))
  assert.equal(state.material.id, 43)
  assert.equal(state.loading, false)
})

test("material fetch cannot update state after unmounting", async () => {
  let resolve
  const app = createApp({ globals: { fetch: () => new Promise(done => { resolve = done }) } })
  const useMaterial = app.load("app/hooks/useFetchEducationMaterial/useFetchEducationMaterial.ts").useFetchEducationMaterial
  app.render(() => useMaterial("42", "pl"))
  app.unmount()
  resolve({ ok: true, json: async () => material })
  await flush()
  const state = app.render(() => useMaterial("42", "pl"))
  assert.equal(state.material, null)
})

test("fish detail section preserves independent expand and collapse state", () => {
  const app = createApp()
  const Section = app.load("app/components/FishDetails/FishDetailSection.tsx").default
  let tree = app.screen(Section, { title: "Appearance", children: ["First", "", "Second"] })
  assert.equal(findNodes(tree, node => node.type === "Text").length, 3)
  findNodes(tree, node => node.type === "Pressable")[0].props.onPress()
  tree = app.screen(Section, { title: "Appearance", children: ["First", "", "Second"] })
  assert.equal(findNodes(tree, node => node.type === "Text").length, 1)
  findNodes(tree, node => node.type === "Pressable")[0].props.onPress()
  assert.equal(findNodes(app.screen(Section, { title: "Appearance", children: ["First", "", "Second"] }), node => node.type === "Text").length, 3)
})

test("home actions preserve existing routes and inactive tiles", () => {
  const app = createApp()
  const Actions = app.load("app/components/Home/HomeActions.tsx").default
  const buttons = findNodes(app.screen(Actions), node => node.type === "Pressable")
  assert.equal(buttons.length, 2)
  buttons.forEach(button => button.props.onPress())
  assert.deepEqual(app.requests, ["../(screens)/ecoTips", "/(screens)/recipes/search"])
})

test("theme setting changes mode through the existing theme hook", () => {
  let mode = "light"
  const app = createApp({ dependencies: {
    "@/app/hooks/useTheme/useTheme": { useTheme: () => ({ colors: app.colors, mode, setMode: async next => { mode = next } }) },
  } })
  const Setting = app.load("app/components/Settings/ThemeSetting.tsx").default
  let toggle = findNodes(app.screen(Setting), node => node.type === "Switch")[0]
  assert.equal(toggle.props.value, false)
  toggle.props.onValueChange(true)
  toggle = findNodes(app.screen(Setting), node => node.type === "Switch")[0]
  assert.equal(toggle.props.value, true)
  toggle.props.onValueChange(false)
  assert.equal(mode, "light")
})

for (const cached of [true, false]) {
  test(`PDF hook ${cached ? "reuses a cached file" : "downloads a missing file"}`, async () => {
    const downloads = []
    class Directory { create(options) { assert.equal(options.idempotent, true) } }
    class File {
      constructor() { this.exists = cached; this.size = cached ? 100 : 0; this.uri = "file:///cache/sample.pdf" }
      static async downloadFileAsync(url, destination) { downloads.push(url); return destination }
    }
    const app = createApp({ dependencies: { "expo-file-system": { Directory, File, Paths: { cache: "cache" } } } })
    const usePdf = app.load("app/hooks/useEducationPdf/useEducationPdf.ts").useEducationPdf
    assert.equal(app.render(() => usePdf("http://backend/sample.pdf")).loading, true)
    await flush()
    const state = app.render(() => usePdf("http://backend/sample.pdf"))
    assert.equal(state.localUri, "file:///cache/sample.pdf")
    assert.equal(state.loading, false)
    assert.equal(downloads.length, cached ? 0 : 1)
    state.onError()
    assert.equal(app.render(() => usePdf("http://backend/sample.pdf")).hasError, true)
  })
}

test("PDF hook handles download errors without remaining in loading state", async () => {
  class Directory { create() {} }
  class File {
    constructor() { this.exists = false }
    static async downloadFileAsync() { throw new Error("Offline") }
  }
  const app = createApp({ dependencies: { "expo-file-system": { Directory, File, Paths: { cache: "cache" } } } })
  const usePdf = app.load("app/hooks/useEducationPdf/useEducationPdf.ts").useEducationPdf
  app.render(() => usePdf("http://backend/sample.pdf"))
  await flush()
  const state = app.render(() => usePdf("http://backend/sample.pdf"))
  assert.equal(state.hasError, true)
  assert.equal(state.loading, false)
})

test("video component keeps the native player and its controls", () => {
  const player = { loop: true }
  let source
  const app = createApp({ dependencies: {
    "expo-video": { VideoView: "VideoView", useVideoPlayer: (url, setup) => {
      source = url
      setup(player)
      return player
    } },
  } })
  const Video = app.load("app/components/Education/EducationVideoView.tsx").default
  const tree = app.screen(Video, { url: "http://backend/video.mp4" })
  assert.equal(source, "http://backend/video.mp4")
  assert.equal(player.loop, false)
  assert.equal(tree.type, "VideoView")
  assert.equal(tree.props.player, player)
  assert.equal(tree.props.nativeControls, true)
  assert.equal(tree.props.contentFit, "contain")
  assert.equal(tree.props.fullscreenOptions.enable, true)
})

test("video component retains the missing-material message", () => {
  const app = createApp({ dependencies: {
    "expo-video": { VideoView: "VideoView", useVideoPlayer: () => ({}) },
  } })
  const Video = app.load("app/components/Education/EducationVideoView.tsx").default
  const tree = app.screen(Video, { url: "" })
  assert.equal(findNodes(tree, node => node.type === "VideoView").length, 0)
  assert.equal(findNodes(tree, node => node.type === "Text")[0].props.children, "education.video.notFound")
})

test("fish favorite hook preserves the existing local storage format", async () => {
  let stored = "[5]"
  const app = createApp({ dependencies: {
    "@react-native-async-storage/async-storage": {
      getItem: async key => { assert.equal(key, "favoriteFishIds"); return stored },
      setItem: async (key, value) => { assert.equal(key, "favoriteFishIds"); stored = value },
    },
  } })
  const useFavorite = app.load("app/hooks/useFishFavorite/useFishFavorite.ts").useFishFavorite
  app.render(() => useFavorite(5))
  await flush()
  let state = app.render(() => useFavorite(5))
  assert.equal(state.isFavorite, true)
  await state.toggleFavorite()
  state = app.render(() => useFavorite(5))
  assert.equal(state.isFavorite, false)
  assert.equal(stored, "[]")
  await state.toggleFavorite()
  assert.equal(app.render(() => useFavorite(5)).isFavorite, true)
  assert.equal(stored, "[5]")
})

test("education media back action preserves both navigation paths", () => {
  for (const canGoBack of [true, false]) {
    const navigation = []
    const load = createModuleLoader({ "expo-router": { router: {
      canGoBack: () => canGoBack,
      back: () => navigation.push("back"),
      replace: href => navigation.push(href),
    } } })
    load("app/utils/education/goBackToEducationMaterial.ts").goBackToEducationMaterial()
    assert.deepEqual(navigation, [canGoBack ? "back" : "/(tabs)/education"])
  }
})

test("fish route parameter parsing stays compatible with serialized fish data", () => {
  const parser = createModuleLoader()("app/utils/fish/parseFishParam.ts")
  const fish = { id: 5, name: "Carp" }
  assert.deepEqual(normalize(parser.parseFishParam([JSON.stringify(fish)])), fish)
  assert.equal(parser.parseFishParam("invalid json"), undefined)
  assert.equal(parser.parseFishParam(undefined), undefined)
})
