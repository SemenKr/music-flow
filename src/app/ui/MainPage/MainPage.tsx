import { useGetMeQuery } from '@/features/auth'

export const MainPage = () => {
  const { data } = useGetMeQuery(undefined)

  return (
    <div>
      <h1>Main page</h1>
      <div>login: {data?.login} </div>
    </div>
  )
}
