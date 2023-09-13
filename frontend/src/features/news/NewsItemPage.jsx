import { BookOpenIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid'
import { HeartIcon as HeartIconOutline } from '@heroicons/react/24/outline'
import NewsOptionsPanel from './NewsOptionsPanel'
import { useSelector } from 'react-redux'
import { selectUserById } from '../users/usersApiSlice'
import useAuth from '../../hooks/useAuth'
import { useUpdateNewsMutation } from './newsApiSlice'

const NewsItemPage = ({ news }) => {
  const user = useSelector(state => selectUserById(state, news.user)) || {
    username: 'Неизвестен',
  }

  const [updateNews, { isLoading, isSuccess, isError, error }] =
    useUpdateNewsMutation()

  const { isEditor, userId } = useAuth()

  const created = new Date(news.createdAt).toLocaleString('ru', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  })

  const imgElement = news.picturePath ? (
    <img
      src={news.picturePath}
      alt={news.title}
      className="mb-2 rounded-lg w-fit max-h-96 object-cover"
    />
  ) : (
    <BookOpenIcon className="h-10 w-10 text-blue-600" />
  )

  const likeIcon = news.likes.includes(userId) ? (
    <HeartIconSolid className="h-6 w-6 text-blue-600" />
  ) : (
    <HeartIconOutline className="h-6 w-6 text-blue-600" />
  )

  const onLikeClickHandle = async () => {
    await updateNews({ id: news, userId })
  }

  return (
    <>
      {isEditor && <NewsOptionsPanel news={news} />}
      <div className="bg-white rounded-lg shadow p-4 mx-auto">
        <h1 className="text-3xl font-bold">{news.title}</h1>
        <div className="mb-2">
          <span className="text-gray-500 text-sm mt-2 mr-4">
            Дата новости: {created}
          </span>
          <span className="text-gray-500 text-sm mt-2 mr-4">
            Автор: {user.username}
          </span>
        </div>

        {imgElement}

        <div className="text-lg leading-7 mb-8 whitespace-pre-wrap">
          {news.content}
        </div>

        <div className="flex items-center justify-start">
          <div className="flex items-center">
            <button
              onClick={onLikeClickHandle}
              className="mr-1 rounded-md hover:bg-gray-200 transition duration-300 p-1"
            >
              {likeIcon}
            </button>
            <span className="mr-3">{news.likes.length}</span>
          </div>
        </div>
      </div>
    </>
  )
}
export default NewsItemPage
