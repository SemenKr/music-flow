// 🛡 Type Guard — проверяет, что объект содержит accessToken и refreshToken
export const isTokens = (
    data: unknown
): data is { accessToken: string; refreshToken: string } => {
    return (
        // 📦 Проверяем, что это объект
        typeof data === 'object' &&
        data !== null &&

        // 🔑 Проверяем наличие нужных полей
        'accessToken' in data &&
        'refreshToken' in data
    )
}
