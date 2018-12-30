export const getTodayNoon = () => {
  const current = new Date()
  current.setHours(0)
  current.setMinutes(0)
  current.setSeconds(0)
  current.setMilliseconds(0)

  return current
}
