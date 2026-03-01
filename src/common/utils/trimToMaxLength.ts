export function trimToMaxLength(str: string, maxLength = 100): string {
  // ✂️ Если длина строки превышает максимальную —
  // обрезаем её так, чтобы вместе с "..." итоговая длина не превышала maxLength
  return str.length > maxLength
      ? str.slice(0, maxLength - 3) + '...'
      : str // ✅ Если строка короче лимита — возвращаем без изменений
}
