import { FireIcon } from '@heroicons/react/24/solid'
import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import { useSendLogoutMutation } from '../features/auth/authApiSlice'
import usePersist from '../hooks/usePersist'
import useAuth from '../hooks/useAuth'

const SiteHeader = () => {
  const [persist, setPersist] = usePersist()
  const { username, isAdmin, userId } = useAuth()

  const [sendLogout, { isLoading, isSuccess, isError, error }] =
    useSendLogoutMutation()

  useEffect(() => {
    if (isSuccess) {
      setPersist(false)
      localStorage.setItem('persist', false)
      location.reload()
    }
  }, [isSuccess])

  const logoutButton = (
    <button
      onClick={sendLogout}
      className="text-gray-900 hover:text-gray-400 transition duration-300"
    >
      Выйти
    </button>
  )
  const loginLink = (
    <Link
      to="login"
      className="text-gray-900 hover:text-gray-400 transition duration-300"
    >
      Войти
    </Link>
  )

  return (
    <header className="flex items-center justify-between py-4 px-8 bg-white shadow sticky top-0 w-full z-10">
      <Link
        to="/"
        title="Главная"
        className="flex items-center justify-between"
      >
        <FireIcon className="h-6 w-6 text-blue-900 hover:text-blue-400 transition duration-300 mr-2" />
        <div className="hidden sm:block text-gray-900 hover:text-gray-400 transition duration-300">
          Коротко о видеоиграх
        </div>
      </Link>
      <nav>
        <ul className="flex space-x-4 items-center">
          {isAdmin && (
            <li>
              <Link
                to="users"
                className="text-gray-900 hover:text-gray-400 transition duration-300"
              >
                Список пользователей
              </Link>
            </li>
          )}

          {username ? (
            <>
              <li>
                <Link
                  to={`/users/edit/${userId}`}
                  className="text-gray-900 hover:text-gray-400 transition duration-300"
                >
                  {username}
                </Link>
              </li>
              <li>{logoutButton}</li>
            </>
          ) : (
            <li>{loginLink}</li>
          )}
        </ul>
      </nav>
    </header>
  )
}
export default SiteHeader
