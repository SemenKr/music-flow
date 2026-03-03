import { baseApi } from '@/app/api/baseApi'
import {AUTH_KEYS} from '@/common/constants';
import type {LoginArgs, LoginResponse, MeResponse} from '@/features/auth/api/authApi.types'

export const authApi = baseApi.injectEndpoints({
  endpoints: build => ({
    getMe: build.query<MeResponse, void>({
      query: () => `auth/me`,
      providesTags: ['Auth']
    }),
    login: build.mutation<LoginResponse, LoginArgs>({
      query: (payload) => {
        return {
          method: 'post',
          url: 'auth/login',
          body:{...payload, accessTokenTTL: '3m'}
        }
      },
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled
        localStorage.setItem(AUTH_KEYS.accessToken, data.accessToken)
        localStorage.setItem(AUTH_KEYS.refreshToken, data.refreshToken)
        // Invalidate after saving tokens
        dispatch(authApi.util.invalidateTags(['Auth']))
      },
    })
  }),
})

export const { useGetMeQuery, useLoginMutation } = authApi
