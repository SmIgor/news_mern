import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectUserById } from './usersApiSlice'

const UserListItem = ({ userId }) => {
  const user = useSelector(state => selectUserById(state, userId))

  if (user) {
    return (
      <tr>
        <td className="border px-4 py-2">{user.username}</td>
        <td className="border px-4 py-2">{user.roles.join(', ')}</td>
        <td className="border px-4 py-2">
          <Link
            to={`/users/edit/${user.id}`}
            className="text-gray-900 hover:text-gray-400 transition duration-300"
          >
            Редактировать
          </Link>
        </td>
      </tr>
    )
  } else return null
}
export default UserListItem
