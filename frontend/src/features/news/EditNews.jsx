import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectNewsById } from './newsApiSlice'
import LoadingSpinner from '../../components/LoadingSpinner'
import EditNewsPage from './EditNewsPage'

const EditNews = () => {
  const { id } = useParams()

  const news = useSelector(state => selectNewsById(state, id))

  const content = news ? <EditNewsPage news={news} /> : <LoadingSpinner />

  return content
}
export default EditNews
