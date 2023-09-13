const User = require('../models/User')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')

// @desc Get all users
// @route GET /users
// @access Public
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password').lean()
  if (!users?.length) {
    return res.status(400).json({ message: 'Пользователи не найдены' })
  }
  res.json(users)
})

// @desc Create new user
// @route POST /users
// @access Public
const createNewUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body

  if (!username || !password || !email) {
    return res.status(400).json({ message: 'Заполните все поля' })
  }

  const duplicateUsername = await User.findOne({ username }).lean().exec()
  const duplicateEmail = await User.findOne({ email }).lean().exec()
  if (duplicateUsername || duplicateEmail) {
    return res
      .status(409)
      .json({ message: 'Имя пользователя или почта уже используются' })
  }

  const hashedPwd = await bcrypt.hash(password, 10)

  const userObject = { username, password: hashedPwd, email }
  const user = await User.create(userObject)

  if (user) {
    res.status(201).json({ message: `Новый пользователь ${username} создан` })
  } else {
    res
      .status(400)
      .json({ message: 'Получены некорректные данные пользователя' })
  }
})

// @desc Update user
// @route PATCH /users
// @access Private
const updateUser = asyncHandler(async (req, res) => {
  const { id, username, roles, email, password } = req.body

  if (!id || !username || !Array.isArray(roles) || !roles.length) {
    return res.status(400).json({ message: 'All field are required' })
  }

  const user = await User.findById(id).exec()
  if (!user) {
    return res.status(400).json({ message: 'User not found' })
  }

  const duplicate = await User.findOne({ username }).lean().exec()

  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: 'Duplicate username' })
  }

  if (username) {
    user.username = username
  }

  if (roles) {
    user.roles = roles
  }

  if (email) {
    user.email = email
  }

  if (password) {
    user.password = await bcrypt.hash(password, 10)
  }

  const updatedUser = await user.save()

  res.json({ message: `${updatedUser.username} обновлен` })
})

// @desc Delete user
// @route DELETE /users
// @access Private
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.body

  if (!id) {
    return res.status(400).json({ message: 'Необходимо ID пользователя' })
  }

  const user = await User.findById(id).exec()

  if (!user) {
    return res.status(400).json({ message: 'Пользователь не найден' })
  }

  const result = await user.deleteOne()

  const reply = `Пользователь ${result.username} с ID ${result._id} удален`

  res.json(reply)
})

module.exports = {
  getAllUsers,
  createNewUser,
  updateUser,
  deleteUser,
}
