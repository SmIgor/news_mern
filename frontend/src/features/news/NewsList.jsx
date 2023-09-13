import { selectAllNews, useGetNewsQuery } from './newsApiSlice'
import NewsListItem from './NewsListItem'

import { useNavigate } from 'react-router-dom'

import { useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import useAuth from '../../hooks/useAuth'

const NewsList = () => {
  const {
    data: news,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetNewsQuery(undefined, {
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  })
  const navigate = useNavigate()
  const { isEditor } = useAuth()

  const onAddNewNewsClicked = () => {
    navigate('/new')
  }

  const [titleToSearch, setTitleToSearch] = useState('')

  const inputRef = useRef(null)
  const onSearchClicked = () => {
    setTitleToSearch(inputRef.current.value)
  }

  const newsToRender = useSelector(state =>
    titleToSearch
      ? selectAllNews(state).filter(newsItem =>
          newsItem.title.includes(titleToSearch)
        )
      : selectAllNews(state)
  )

  const gridContent = newsToRender?.length
    ? newsToRender.map(newsItem => (
        <NewsListItem key={newsItem.id} newsId={newsItem.id} />
      ))
    : null

  const content = (
    <>
      <div className="flex flex-col bg-white rounded-lg shadow p-2 mx-auto mb-2">
        <div>
          <input
            type="text"
            className="border rounded py-2 px-3 mr-2 mb-2 outline outline-1 outline-gray-400"
            ref={inputRef}
          />
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 mb-2 rounded"
            onClick={onSearchClicked}
          >
            Найти по заголовку
          </button>
        </div>
        {isEditor && (
          <div>
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
              onClick={onAddNewNewsClicked}
            >
              Добавить новость
            </button>
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-stretch">
        {gridContent}
      </div>
    </>
  )

  return content
}

export default NewsList
