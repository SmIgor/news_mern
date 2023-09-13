import { useSelector } from 'react-redux'
import { selectCurrentToken } from '../features/auth/authSlice'
import jwtDecode from 'jwt-decode'
import { ROLES } from '../config/roles'

const useAuth = () => {
  const token = useSelector(selectCurrentToken)
  let isUser = false
  let isEditor = false
  let isAdmin = false
  let status = ROLES.User

  if (token) {
    const decoded = jwtDecode(token)
    const { username, roles, userId } = decoded.UserInfo

    isUser = true
    isEditor = roles.includes(ROLES.Editor)
    isAdmin = roles.includes(ROLES.Admin)

    if (isEditor) status = ROLES.Editor
    if (isAdmin) status = ROLES.Admin

    return { username, roles, status, isEditor, isAdmin, isUser, userId }
  }

  return {
    username: '',
    roles: [],
    isEditor,
    isAdmin,
    isUser,
    status,
    userId: '',
  }
}
export default useAuth
