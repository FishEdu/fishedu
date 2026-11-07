export const padNumber = (value: number) =>
  String(value).padStart(2, "0")

export const formatDateToIso = (date: Date) =>
  `${date.getFullYear()}-${padNumber(date.getMonth() + 1)}-${padNumber(date.getDate())}`

export const isValidDate = (value: string) => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)

  if (!match) return false

  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])

  const date = new Date(year, month - 1, day)

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  )
}

export const parseDateFromIso = (value: string) => {
  if (!isValidDate(value)) return new Date()

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)!

  return new Date(
    Number(match[1]),
    Number(match[2]) - 1,
    Number(match[3])
  )
}

export const getCalendarDays = (month: Date): (Date | null)[] => {
  const year = month.getFullYear()
  const monthIndex = month.getMonth()

  const firstDay = new Date(year, monthIndex, 1)
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate()

  // Poniedziałek jest pierwszym dniem tygodnia.
  const offset = (firstDay.getDay() + 6) % 7

  const totalCells = Math.ceil((offset + daysInMonth) / 7) * 7

  return Array.from({ length: totalCells }, (_, index) => {
    const day = index - offset + 1

    if (day < 1 || day > daysInMonth) return null

    return new Date(year, monthIndex, day)
  })
}

export const isSameDay = (first: Date, second: Date) =>
  first.getFullYear() === second.getFullYear() &&
  first.getMonth() === second.getMonth() &&
  first.getDate() === second.getDate()