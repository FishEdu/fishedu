const assert = require("node:assert/strict")
const fs = require("node:fs")
const path = require("node:path")
const test = require("node:test")
const vm = require("node:vm")
const ts = require("typescript")

function loadModule(filename, dependencies = {}, globals = {}) {
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
    module, exports: module.exports, AbortController,
    require(name) {
      if (!(name in dependencies)) throw new Error(`Unexpected import: ${name}`)
      return dependencies[name]
    },
    ...globals,
  }, { filename })
  return module.exports
}

const grading = loadModule("app/utils/education/calculateQuizResult.ts")
const normalize = value => JSON.parse(JSON.stringify(value))

function createQuiz(count = 3, passingScore = 67) {
  return {
    id: 1,
    passing_score: passingScore,
    questions: Array.from({ length: count }, (_, index) => ({
      id: index + 1,
      content: `Question ${index + 1}`,
      options: [
        { id: index * 10 + 1, content: "Correct", is_correct: true },
        { id: index * 10 + 2, content: "Wrong", is_correct: false },
      ],
    })),
  }
}

test("two correct answers out of three meet the existing 67 percent threshold", () => {
  assert.deepEqual(normalize(grading.calculateQuizResult(createQuiz(), { 1: 1, 2: 11, 3: 22 })), {
    correct_answers: 2, total_questions: 3, score: 67, passed: true,
  })
})

test("all correct and all incorrect answers produce the expected results", () => {
  const quiz = createQuiz(2, 100)
  assert.deepEqual(normalize(grading.calculateQuizResult(quiz, { 1: 1, 2: 11 })), {
    correct_answers: 2, total_questions: 2, score: 100, passed: true,
  })
  assert.deepEqual(normalize(grading.calculateQuizResult(quiz, { 1: 2, 2: 12 })), {
    correct_answers: 0, total_questions: 2, score: 0, passed: false,
  })
})

test("answers from another question or an unknown question do not count", () => {
  const result = grading.calculateQuizResult(createQuiz(), { 1: 11, 2: 11, 99: 1 })
  assert.equal(result.correct_answers, 1)
  assert.equal(result.total_questions, 3)
  assert.equal(result.passed, false)
})

test("percentage rounding remains compatible with the server", () => {
  assert.equal(grading.calculateQuizResult(createQuiz(8), { 1: 1 }).score, 12)
  assert.equal(grading.calculateQuizResult(createQuiz(8), { 1: 1, 2: 11, 3: 21 }).score, 38)
})

test("empty quizzes and old payloads without correct-answer flags cannot be graded", () => {
  const empty = createQuiz(0)
  assert.equal(grading.canGradeQuiz(empty), false)
  assert.throws(() => grading.calculateQuizResult(empty, {}), /incomplete/)
  const oldPayload = createQuiz()
  delete oldPayload.questions[0].options[0].is_correct
  assert.equal(grading.canGradeQuiz(oldPayload), false)
  assert.equal(grading.canGradeQuiz(null), false)
})

test("invalid thresholds and questions without a correct answer are rejected", () => {
  for (const threshold of [-1, 101, NaN]) {
    assert.equal(grading.canGradeQuiz(createQuiz(3, threshold)), false)
  }
  const quiz = createQuiz()
  quiz.questions[0].options[0].is_correct = false
  quiz.questions[0].options[1].is_correct = false
  assert.equal(grading.canGradeQuiz(quiz), false)
})

test("any correct option is accepted when a question has multiple valid answers", () => {
  const quiz = createQuiz(1, 100)
  quiz.questions[0].options[1].is_correct = true
  assert.equal(grading.canGradeQuiz(quiz), true)
  assert.equal(grading.calculateQuizResult(quiz, { 1: 1 }).passed, true)
  assert.equal(grading.calculateQuizResult(quiz, { 1: 2 }).passed, true)
})

function createScreen() {
  const states = []
  let cursor = 0
  let effect
  let offline = false
  const requests = []
  const material = { id: 42, type: "quiz", title: "Sample quiz", quiz: createQuiz(2) }
  const colors = loadModule("app/constants/theme.ts").lightColors
  const jsx = (type, props) => ({ type, props })
  const { default: Screen } = loadModule("app/(tabs)/education/quiz.tsx", {
    react: {
      useState(initial) {
        const index = cursor++
        if (!(index in states)) states[index] = initial
        return [states[index], next => { states[index] = typeof next === "function" ? next(states[index]) : next }]
      },
      useEffect(callback) { effect ??= callback },
    },
    "react/jsx-runtime": { jsx, jsxs: jsx },
    "react-native": {
      ActivityIndicator: "ActivityIndicator", Pressable: "Pressable", Text: "Text", View: "View",
      StyleSheet: { create: styles => styles },
    },
    "@/app/components/ui/Container": "Container",
    "@/app/hooks/useTheme/useTheme": { useTheme: () => ({ colors }) },
    "@/app/hooks/useLanguage/useLanguage": { useLanguage: () => ({ language: "pl" }) },
    "@/app/utils/getBaseApiUrl": { getBaseApiUrl: () => "http://backend/api/v1" },
    "@/app/utils/translation/getTranslation": { getTranslation: key => key },
    "@/app/utils/education/calculateQuizResult": grading,
    "@expo/vector-icons/Ionicons": "Ionicons",
    "expo-router": { router: { back() {} }, useLocalSearchParams: () => ({ id: "42" }) },
  }, {
    fetch: async (url, options) => {
      requests.push({ url, options })
      if (offline) throw new Error("Network unavailable")
      return { ok: true, json: async () => material }
    },
  })
  const render = () => {
    cursor = 0
    let node = Screen()
    if (typeof node.type === "function") node = node.type(node.props)
    return node
  }
  render()
  effect()
  return { render, requests, goOffline: () => { offline = true } }
}

function findNodes(node, predicate) {
  if (Array.isArray(node)) return node.flatMap(child => findNodes(child, predicate))
  if (!node || typeof node !== "object") return []
  return [...(predicate(node) ? [node] : []), ...findNodes(node.props?.children, predicate)]
}

function pressAction(tree, translationKey) {
  const button = findNodes(tree, node => node.type === "Pressable" &&
    findNodes(node.props.children, child => child.type === "Text" && child.props.children === translationKey).length > 0
  )[0]
  assert.ok(button, `Missing action ${translationKey}`)
  button.props.onPress()
}

test("the quiz screen completes and restarts offline without a submit request", async () => {
  const screen = createScreen()
  await new Promise(resolve => setImmediate(resolve))
  screen.goOffline()
  for (const action of ["education.quiz.next", "education.quiz.finish"]) {
    findNodes(screen.render(), node => node.props?.accessibilityRole === "radio")[0].props.onPress()
    pressAction(screen.render(), action)
  }
  assert.ok(findNodes(screen.render(), node => node.type === "Text" && node.props.children === "education.quiz.passed").length)
  const score = findNodes(screen.render(), node => node.type === "Text" && Array.isArray(node.props.children))
  assert.ok(score.some(node => node.props.children.join("") === "100%"))
  pressAction(screen.render(), "education.quiz.retry")
  const options = findNodes(screen.render(), node => node.props?.accessibilityRole === "radio")
  assert.ok(options.every(node => !node.props.accessibilityState.checked))
  assert.equal(screen.requests.length, 1)
  assert.equal(screen.requests[0].url, "http://backend/api/v1/education-materials/42?language=pl")
  assert.equal(screen.requests[0].options.method, undefined)
})

test("the quiz screen requires a selected answer before advancing", async () => {
  const screen = createScreen()
  await new Promise(resolve => setImmediate(resolve))
  pressAction(screen.render(), "education.quiz.next")
  assert.ok(findNodes(screen.render(), node => node.type === "Text" && node.props.children === "education.quiz.selectAnswer").length)
  assert.equal(screen.requests.length, 1)
})
