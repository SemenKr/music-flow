export function isErrorWithProperty<T extends string>(
    error: unknown,
    property: T
): error is Record<T, string> {
    return (
        // 🧱 Проверяем, что это объект (и не null)
        typeof error === 'object'
        && error != null
       // 🔎 Проверяем наличие переданного свойства
        && property in error
        // 📝 Убеждаемся, что значение этого свойства — строка
        && typeof (error as Record<string, unknown>)[property] === 'string'
    )
}
