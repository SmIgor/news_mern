import { useGetUsersQuery } from './usersApiSlice'
import UserListItem from './UserListItem'
import LoadingSpinner from '../../components/LoadingSpinner'

const UsersList = () => {
  const {
    data: users,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetUsersQuery(undefined, {
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  })

  let content

  if (isLoading) content = <LoadingSpinner />

  if (isError) {
    content = <p>{error?.data?.message}</p>
  }

  if (isSuccess) {
    const { ids } = users

    const tableContent = ids?.length
      ? ids.map(userId => <UserListItem key={userId} userId={userId} />)
      : null

    content = (
      <div className="bg-white rounded-lg shadow p-4 mx-auto">
        <table className="table-auto w-full">
          <thead>
            <tr>
              <th className="px-4 pb-4">Имя пользователя</th>
              <th className="px-4 pb-4">Роли пользователя</th>
              <th className="px-4 pb-4">Опции</th>
            </tr>
          </thead>
          <tbody>{tableContent}</tbody>
        </table>
      </div>
    )
  }

  return content
}
export default UsersList
