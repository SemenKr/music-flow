import { useGetMeQuery } from '@/features/auth/api/authApi'
import { hasStoredAuth } from '@/features/auth/lib/hasStoredAuth'

export const MainPage = () => {
  const { data } = useGetMeQuery(undefined, { skip: !hasStoredAuth() })

  return (
    <div>
      <h1>Main page</h1>
      <div>login: {data?.login} </div>
    </div>
  )
}
