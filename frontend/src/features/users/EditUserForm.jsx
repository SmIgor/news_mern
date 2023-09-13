import { useState, useEffect } from 'react'
import { useUpdateUserMutation, useDeleteUserMutation } from './usersApiSlice'
import { useNavigate, useParams } from 'react-router-dom'
import { ROLES } from '../../config/roles'
import useAuth from '../../hooks/useAuth'

const USER_REGEX = /^[A-z0-9]{3,20}$/
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/
const EMAIL_REGEX = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w+)+$/

const EditUserForm = ({ user }) => {
  const { id } = useParams()
  const { userId, isAdmin } = useAuth()
  if (id !== userId && !isAdmin)
    return (
      <p className="mx-auto bg-red-100 text-xl font-bold mb-4 rounded py-2 px-3">
        Ошибка доступа
      </p>
    )

  const [updateUser, { isLoading, isSuccess, isError, error }] =
    useUpdateUserMutation()

  const [
    deleteUser,
    { isSuccess: isDelSuccess, isError: isDelError, error: delerror },
  ] = useDeleteUserMutation()

  const navigate = useNavigate()

  const [username, setUsername] = useState(user.username)
  const [validUsername, setValidUsername] = useState(false)
  const [email, setEmail] = useState(user.email)
  const [validEmail, setValidEmail] = useState(false)
  const [password, setPassword] = useState('')
  const [validPassword, setValidPassword] = useState(false)
  const [roles, setRoles] = useState(user.roles)

  useEffect(() => {
    setValidUsername(USER_REGEX.test(username))
  }, [username])

  useEffect(() => {
    setValidPassword(PWD_REGEX.test(password))
  }, [password])

  useEffect(() => {
    setValidEmail(EMAIL_REGEX.test(email))
  }, [email])

  useEffect(() => {
    if (isSuccess || isDelSuccess) {
      navigate('/')
    }
  }, [isSuccess, isDelSuccess, navigate])

  const onUsernameChanged = e => setUsername(e.target.value)
  const onPasswordChanged = e => setPassword(e.target.value)
  const onEmailChanged = e => setEmail(e.target.value)
  const onRolesChanged = e => {
    const rolesList = [...roles]
    const selecredRole = e.target.value
    const index = rolesList.indexOf(selecredRole)
    if (index > -1) {
      rolesList.splice(index, 1)
    } else {
      rolesList.push(selecredRole)
    }
    setRoles(rolesList)
  }

  const onSaveUserClicked = async e => {
    e.preventDefault()
    if (password) {
      await updateUser({ id: user.id, username, password, email, roles })
    } else {
      await updateUser({ id: user.id, username, email, roles })
    }
  }

  const onDeleteUserClicked = async () => {
    await deleteUser({ id: user.id })
  }

  const rolesCheckboxes = Object.values(ROLES).map(role => (
    <label key={role} className="inline-flex items-center mr-4">
      <input
        type="checkbox"
        value={role}
        checked={roles.includes(role)}
        onChange={onRolesChanged}
        className="form-checkbox h-5 w-5 text-blue-600"
      />
      <span className="ml-2 text-gray-700">{role}</span>
    </label>
  ))

  let canSave
  if (password) {
    canSave =
      [validUsername, validPassword, validEmail].every(Boolean) && !isLoading
  } else {
    canSave = [validUsername, validEmail].every(Boolean) && !isLoading
  }

  const errContent = (error?.data?.message || delerror?.data?.message) ?? ''

  const content = (
    <>
      {errContent ? (
        <p className="mx-auto max-w-2xl bg-red-100 text-xl font-bold mb-4 rounded py-2 px-3">
          {errContent}
        </p>
      ) : null}

      <div className="mx-auto max-w-2xl">
        <h2 className="text-xl font-bold mb-4">
          Редактирование пользователя {user.username}
        </h2>
        <form onSubmit={onSaveUserClicked}>
          <div className="mb-4">
            <label htmlFor="username" className="block font-bold mb-2">
              Имя пользователя
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={onUsernameChanged}
              className="border rounded py-2 px-3 w-full"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block font-bold mb-2">
              Почта
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={onEmailChanged}
              className="border rounded py-2 px-3 w-full"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block font-bold mb-2">
              Новый пароль
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={onPasswordChanged}
              className="border rounded py-2 px-3 w-full"
            />
          </div>
          {isAdmin && (
            <div className="mb-4">
              <p className="font-bold mb-2">Установить роли</p>
              {rolesCheckboxes}
            </div>
          )}
          <div className="flex justify-between">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
              disabled={!canSave}
            >
              Сохранить изменения
            </button>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
              onClick={onDeleteUserClicked}
            >
              Удалить пользователя
            </button>
          </div>
        </form>
      </div>
    </>
  )

  return content
}
export default EditUserForm
