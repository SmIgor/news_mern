import { Outlet, Link } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { useRefreshMutation } from './authApiSlice'
import usePersist from '../../hooks/usePersist'
import { useSelector } from 'react-redux'
import { selectCurrentToken } from './authSlice'
import LoadingSpinner from '../../components/LoadingSpinner'

const PersistLogin = () => {
  const [persist, setPersist] = usePersist()
  const token = useSelector(selectCurrentToken)
  const effectRan = useRef(false)

  const [trueSuccess, setTrueSuccess] = useState(false)

  const [refresh, { isUninitialized, isLoading, isSuccess, isError, error }] =
    useRefreshMutation()
  useEffect(() => {
    if (effectRan.current === true || process.env.NODE_ENV !== 'development') {
      const verifyRefreshToken = async () => {
        try {
          await refresh()
          setTrueSuccess(true)
        } catch (err) {
          console.error(err)
        }
      }

      if (!token && persist) verifyRefreshToken()
    }

    return () => (effectRan.current = true)
  }, [])

  let content
  if (!persist) {
    content = <Outlet />
  } else if (isLoading) {
    content = <LoadingSpinner />
  } else if (isError) {
    setPersist(false)
    localStorage.setItem('persist', false)
    content = (
      <>
        <p className="mx-auto bg-red-100 text-xl font-bold mb-4 rounded py-2 px-3">
          {error?.data?.message}
        </p>
        <Link
          to="/"
          className="text-gray-900 hover:text-gray-400 transition duration-300"
        >
          На главную
        </Link>
      </>
    )
  } else if (isSuccess && trueSuccess) {
    content = <Outlet />
  } else if (token && isUninitialized) {
    content = <Outlet />
  }

  return content
}
export default PersistLogin
