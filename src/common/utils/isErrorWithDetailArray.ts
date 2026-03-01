export function isErrorWithDetailArray(error: unknown): error is { errors: { detail: string }[] } {
  // 🧱 Проверяем, что значение является объектом и не равно null
  if (typeof error !== 'object' || error === null) {
    return false
  }

  // 🔎 Проверяем наличие свойства "errors"
  if (!('errors' in error)) {
    return false
  }

  // 📦 Получаем значение свойства errors
  const maybeErrors = (error as Record<string, unknown>).errors

  // 📋 Убеждаемся, что errors — это непустой массив
  if (!Array.isArray(maybeErrors) || maybeErrors.length === 0) {
    return false
  }

  // 🔍 Берём первый элемент массива для проверки структуры
  const first = maybeErrors[0]

  return (
    // 🧱 Проверяем, что элемент — объект
    typeof first === 'object' &&
    first !== null &&
    // 🔎 Проверяем наличие свойства "detail"
    'detail' in first &&
    // 📝 Убеждаемся, что detail — строка
    typeof (first as Record<string, unknown>).detail === 'string'
  )
}
