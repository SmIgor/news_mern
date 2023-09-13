import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectNewsById } from './newsApiSlice'
import { HeartIcon } from '@heroicons/react/24/solid'
import { BookOpenIcon } from '@heroicons/react/24/outline'

const NewsListItem = ({ newsId }) => {
  const news = useSelector(state => selectNewsById(state, newsId))

  if (news) {
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
        className="mb-2 rounded-lg w-full h-40 object-cover"
      />
    ) : (
      <div className="w-full h-40 mb-2 flex items-center justify-center">
        <BookOpenIcon className="h-10 w-10 text-blue-600" />
      </div>
    )

    return (
      <Link to={`/${newsId}`} title="На страницу новости">
        <div className="bg-white rounded-lg shadow p-4">
          {imgElement}
          <h2 className="text-lg font-bold mb-2">{news.title}</h2>
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span className="mr-2">{created}</span>
            <div className="flex items-center justify-end">
              <div className="flex items-center">
                <span className="mr-1">
                  <HeartIcon className="h-4 w-4 text-blue-600" />{' '}
                </span>
                <span className="mr-3">{news.likes.length}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    )
  } else return null
}
export default NewsListItem
