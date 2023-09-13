const News = require('../models/News')
const User = require('../models/User')
const asyncHandler = require('express-async-handler')
const fs = require('fs')
const { promisify } = require('util')
const pipeline = promisify(require('stream').pipeline)

// @desc Get all news
// @route GET /news
// @access Public
const getAllNews = asyncHandler(async (req, res) => {
  const news = await News.find().lean()
  if (!news?.length) {
    return res.status(400).json({ message: 'Новости не найдены' })
  }

  res.json(news)
})

// @desc Create new news
// @route POST /news
// @access Private
const createNewNews = asyncHandler(async (req, res) => {
  const { user, title, content } = req.body
  const imageFile = req.file || null

  // Confirm data
  if (!user || !title || !content) {
    return res.status(400).json({ message: 'Заполните все поля' })
  }

  if (imageFile && imageFile.mimetype != 'image/jpeg') {
    throw new Error('Неверный формат файла')
  }

  let newsObject
  if (imageFile) {
    newsObject = {
      user,
      title,
      content,
      picturePath: `http://localhost:3500/${imageFile.filename}`,
    }
  } else {
    newsObject = { user, title, content }
  }
  // Create and store new news item

  const news = await News.create(newsObject)

  if (news) {
    res.status(201).json({ message: `Новость ${title} создана` })
  } else {
    res.status(400).json({ message: 'Получены некорректные данные' })
  }
})

// @desc Update news
// @route PATCH /news
// @access Private
const updateNews = asyncHandler(async (req, res) => {
  const { id, title, content, userId } = req.body
  const imageFile = req.file || null

  // Confirm data
  if (!id) {
    return res.status(400).json({ message: 'Необходим ID новости' })
  }

  if (imageFile && imageFile.mimetype != 'image/jpeg') {
    throw new Error('Неверный формат файла')
  }

  const news = await News.findById(id).exec()
  if (!news) {
    return res.status(400).json({ message: 'Новость не найдена' })
  }

  // Updates
  if (userId) {
    if (news.likes.includes(userId)) {
      const index = news.likes.indexOf(userId)
      news.likes.splice(index, 1)
    } else {
      news.likes.push(userId)
    }
  }

  if (imageFile) {
    news.picturePath = `http://localhost:3500/${imageFile.filename}`
  }

  if (title) {
    news.title = title
  }

  if (content) {
    news.content = content
  }

  const updatedNews = await news.save()

  res.json({ message: `Новость ${updatedNews.title} обновлена` })
})

// @desc Delete news
// @route DELETE /news
// @access Private
const deleteNews = asyncHandler(async (req, res) => {
  const { id } = req.body

  if (!id) {
    return res.status(400).json({ message: 'Нужен ID новости' })
  }

  const news = await News.findById(id).exec()

  if (!news) {
    return res.status(400).json({ message: 'Новость не найдена' })
  }

  const result = await news.deleteOne()

  const reply = `Новость ${result.title} с ID ${result._id} удалена`

  res.json(reply)
})

module.exports = {
  getAllNews,
  createNewNews,
  updateNews,
  deleteNews,
}
