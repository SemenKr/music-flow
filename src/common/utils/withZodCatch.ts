import { errorToast } from '@/common/utils/errorToast.ts'
import { type FetchBaseQueryError, NamedSchemaError } from '@reduxjs/toolkit/query/react'
import type { ZodType } from 'zod'

// Универсальная утилита для подключения Zod-валидации к RTK Query endpoint.
// Позволяет не дублировать responseSchema и catchSchemaFailure в каждом endpoint.
export const withZodCatch = <T extends ZodType>(schema: T) => ({

    // Zod-схема, которой будет валидироваться ответ сервера
    responseSchema: schema,

    // Обработчик ошибки, если Zod-валидация ответа не прошла
    catchSchemaFailure: (err: NamedSchemaError): FetchBaseQueryError => {

        // Показываем toast пользователю и выводим подробности в консоль
        // err.issues — список ошибок валидации Zod
        errorToast('Zod error. Details in the console', err.issues)

        // Возвращаем кастомную ошибку для RTK Query
        // Это позволит endpoint корректно перейти в состояние error
        return {
            status: 'CUSTOM_ERROR',
            error: 'Schema validation failed',
        }
    },
})
