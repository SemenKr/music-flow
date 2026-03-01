const SIBLING_COUNT = 1 // 👈 Количество соседних страниц слева и справа от текущей

/**
 * 📄 Генерирует массив страниц для отображения пагинации с многоточиями
 * @param currentPage - текущая активная страница
 * @param pagesCount - общее количество страниц
 * @returns массив номеров страниц и/или '...'
 */
export const getPaginationPages = (currentPage: number, pagesCount: number): (number | '...')[] => {
  // 🚫 Если страниц 0 или 1 — пагинация не нужна
  if (pagesCount <= 1) return []

  const pages: (number | '...')[] = []

  // 📌 Определяем границы диапазона вокруг текущей страницы
  // Минимум — 2, чтобы не дублировать первую страницу
  const leftSibling = Math.max(2, currentPage - SIBLING_COUNT)

  // Максимум — pagesCount - 1, чтобы не дублировать последнюю страницу
  const rightSibling = Math.min(pagesCount - 1, currentPage + SIBLING_COUNT)

  // 🔹 Всегда добавляем первую страницу
  pages.push(1)

  // ⬅️ Добавляем многоточие, если есть пропуск между 1 и левым диапазоном
  if (leftSibling > 2) {
    pages.push('...')
  }

  // 🔢 Добавляем страницы вокруг текущей
  for (let page = leftSibling; page <= rightSibling; page++) {
    pages.push(page)
  }

  // ➡️ Добавляем многоточие, если есть пропуск перед последней страницей
  if (rightSibling < pagesCount - 1) {
    pages.push('...')
  }

  // 🔹 Всегда добавляем последнюю страницу (если их больше одной)
  pages.push(pagesCount)

  return pages
}
