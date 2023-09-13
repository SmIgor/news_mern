import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectNewsById } from './newsApiSlice'
import NewsItemPage from './NewsItemPage'
import LoadingSpinner from '../../components/LoadingSpinner'

const NewsItem = () => {
  const { id } = useParams()

  const news = useSelector(state => selectNewsById(state, id))

  const content = news ? <NewsItemPage news={news} /> : <LoadingSpinner />

  return content
}
export default NewsItem
