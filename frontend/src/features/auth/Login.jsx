import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useDispatch } from 'react-redux'
import { setCredentials } from './authSlice'
import { useLoginMutation } from './authApiSlice'
import LoadingSpinner from '../../components/LoadingSpinner'
import usePersist from '../../hooks/usePersist'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errMsg, setErrMsg] = useState('')
  const [persist, setPersist] = usePersist()

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [login, { isLoading }] = useLoginMutation()

  const onUsernameChanged = e => setUsername(e.target.value)
  const onPasswordChanged = e => setPassword(e.target.value)
  const handleToggle = () => setPersist(prev => !prev)

  const onSaveUserClicked = async e => {
    e.preventDefault()
    try {
      const { accessToken } = await login({ username, password }).unwrap()
      dispatch(setCredentials({ accessToken }))
      setUsername('')
      setPassword('')
      navigate('/')
    } catch (err) {
      if (!err.status) {
        setErrMsg('Сервер не отвечает')
      } else if (err.status === 400) {
        setErrMsg('Нет имени пользователя или пароля')
      } else if (err.status === 401) {
        setErrMsg('Ошибка авторизации')
      } else {
        setErrMsg(err.data?.message)
      }
    }
  }

  const onSignUpButtonClicked = () => {
    navigate('/sign-up')
  }

  const canSave = [username, password].every(Boolean) && !isLoading

  if (isLoading) return <LoadingSpinner />

  const content = (
    <>
      {errMsg ? (
        <p className="mx-auto max-w-2xl bg-red-100 text-xl font-bold mb-4 rounded py-2 px-3">
          {errMsg}
        </p>
      ) : null}

      <div className="mx-auto max-w-2xl">
        <h2 className="text-xl font-bold mb-4">Вход в аккаунт</h2>
        <form onSubmit={onSaveUserClicked} className="mb-8">
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
            <label htmlFor="password" className="block font-bold mb-2">
              Пароль
            </label>
            <input
              type="password"
              id="password"
              value={password}
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
              Войти
            </button>
            <label htmlFor="persist" className="inline-flex items-center mr-4">
              <input
                type="checkbox"
                id="persist"
                checked={persist}
                onChange={handleToggle}
                className="form-checkbox h-5 w-5 text-blue-600"
              />
              <span className="ml-2 text-gray-700">
                Доверять этому устройству?
              </span>
            </label>
          </div>
        </form>
        <div className="mb-4">
          <h2 className="text-xl font-bold mb-2">Нет аккаунта?</h2>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={onSignUpButtonClicked}
          >
            Зарегистрироваться
          </button>
        </div>
      </div>
    </>
  )

  return content
}
export default Login
