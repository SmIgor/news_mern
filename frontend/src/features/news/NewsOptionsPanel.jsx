import { useEffect } from 'react'
import { useDeleteNewsMutation } from './newsApiSlice'
import { useNavigate } from 'react-router-dom'

const NewsOptionsPanel = ({ news }) => {
  const [
    deleteNews,
    { isSuccess: isDelSuccess, isError: isDelError, error: delerror },
  ] = useDeleteNewsMutation()

  const navigate = useNavigate()

  const onDeleteNewsClicked = async () => {
    await deleteNews({ id: news.id })
  }

  const onEditButtonClicked = () => {
    navigate(`/edit/${news.id}`)
  }

  useEffect(() => {
    if (isDelSuccess) {
      navigate('/')
    }
  }, [isDelSuccess, navigate])

  return (
    <div className="bg-white rounded-lg shadow p-2 mx-auto mb-2">
      <button
        className="mr-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        onClick={onEditButtonClicked}
      >
        Редактировать новость
      </button>
      <button
        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
        title="Удалить новость"
        onClick={onDeleteNewsClicked}
      >
        Удалить новость
      </button>
    </div>
  )
}
export default NewsOptionsPanel
