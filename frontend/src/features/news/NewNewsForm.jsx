import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAddNewNewsMutation } from './newsApiSlice'
import useAuth from '../../hooks/useAuth'
import axios from 'axios'
import { selectCurrentToken } from '../auth/authSlice'
import { useSelector } from 'react-redux'

const NewNewsForm = () => {
  const [addNewNews, { isLoading, isSuccess, isError, error }] =
    useAddNewNewsMutation()

  const token = useSelector(selectCurrentToken)
  const navigate = useNavigate()
  const { userId } = useAuth()

  const [imageFile, setImageFile] = useState()
  const [title, setTitle] = useState('')
  const [text, setText] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const canSave = [title, text].every(Boolean) && !isLoading

  const onSaveNewsClicked = async e => {
    e.preventDefault()
    if (canSave) {
      const data = new FormData()
      data.append('user', userId)
      data.append('title', title)
      data.append('content', text)
      imageFile ? data.append('file', imageFile) : null

      try {
        await axios.post('http://localhost:3500/news', data, {
          headers: {
            'Content-Type': 'multipart/form-data',
            authorization: `Bearer ${token}`,
          },
        })
        navigate('/')
      } catch (error) {
        setErrorMsg(error.message)
      }
    }
  }

  const content = (
    <>
      {errorMsg ? (
        <p className="mx-auto bg-red-100 text-xl font-bold mb-4 rounded py-2 px-3">
          {errorMsg}
        </p>
      ) : null}

      <form className="flex flex-col" onSubmit={onSaveNewsClicked}>
        <label htmlFor="imageFile" className="font-bold mb-2">
          Изображение (только формат .jpg)
        </label>
        <input
          type="file"
          id="imageFile"
          accept=".jpg"
          className="border p-2 mb-4"
          onChange={e => {
            const file = e.target.files[0]
            setImageFile(file)
          }}
        />
        <label htmlFor="title" className="font-bold mb-2">
          Заголовок новости
        </label>
        <input
          type="text"
          id="title"
          className="border p-2 mb-4"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
        <label htmlFor="text" className="font-bold mb-2">
          Текст новости
        </label>
        <textarea
          id="text"
          className="border p-2 mb-4"
          value={text}
          onChange={e => setText(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Добавить новость
        </button>
      </form>
    </>
  )

  return content
}

export default NewNewsForm
