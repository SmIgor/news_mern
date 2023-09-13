import { useState, useEffect } from 'react'
import { useAddNewUserMutation } from './usersApiSlice'
import { useNavigate } from 'react-router-dom'

const USER_REGEX = /^[A-z0-9]{3,20}$/
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/
const EMAIL_REGEX = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w+)+$/

const SignUp = () => {
  const [addNewUser, { isLoading, isSuccess, isError, error }] =
    useAddNewUserMutation()

  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [validUsername, setValidUsername] = useState(false)
  const [email, setEmail] = useState('')
  const [validEmail, setValidEmail] = useState(false)
  const [password, setPassword] = useState('')
  const [validPassword, setValidPassword] = useState(false)

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
    if (isSuccess) {
      navigate('/login')
    }
  }, [isSuccess, navigate])

  const onUsernameChanged = e => setUsername(e.target.value)
  const onPasswordChanged = e => setPassword(e.target.value)
  const onEmailChanged = e => setEmail(e.target.value)

  const onSaveUserClicked = async e => {
    e.preventDefault()
    await addNewUser({ username, password, email })
  }

  let canSave =
    [validUsername, validPassword, validEmail].every(Boolean) && !isLoading

  const content = (
    <>
      {error?.data?.message ? (
        <p className="mx-auto max-w-2xl bg-red-100 text-xl font-bold mb-4 rounded py-2 px-3">
          {error?.data?.message}
        </p>
      ) : null}

      <div className="mx-auto max-w-2xl">
        <h2 className="text-xl font-bold mb-4">Регистрация</h2>
        <form onSubmit={onSaveUserClicked}>
          <div className="mb-4">
            <label htmlFor="username" className="block font-bold mb-2">
              Имя пользователя
            </label>
            <input
              type="text"
              id="username"
              value={username}
              placeholder="Минимум 3 символа (английские буквы и цифры)"
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
              placeholder="example@example.example"
              onChange={onEmailChanged}
              className="border rounded py-2 px-3 w-full"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block font-bold mb-2">
              Пароль
            </label>
            <input
              type="password"
              id="password"
              value={password}
              placeholder="Миниум 4 символа (английские буквы, цифры, спецсимволы: !@#$%)"
              onChange={onPasswordChanged}
              className="border rounded py-2 px-3 w-full"
            />
          </div>
          <div className="flex justify-between">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
              disabled={!canSave}
            >
              Создать аккаунт
            </button>
          </div>
        </form>
      </div>
    </>
  )

  return content
}
export default SignUp
