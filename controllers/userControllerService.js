import models from '../models/index'

module.exports.getAllUsers = async (req, res, next) => {
  let users = await models.User.find({})
  if (users.length !== 0) {
    res.send({
      status: {
        code: 0,
        message: 'Users found successfully.'
      },
      users
    })
  } else {
    res.status(201).send({
      status: {
        code: 1,
        message: 'Users not found.'
      }
    })
  }
}
module.exports.addUser = async (req, res, next) => {
  let email = req.body.email
  let username = req.body.username
  let user = await models.User.findOne({
    email
  })
  if (user) {
    res.status(400).send({
      status: {
        code: 1,
        message: 'User with same email already exists'
      }
    })
  } else {
    let newUser = new models.User({
      email,
      username
    })
    await newUser.save()
    res.send({
      status: {
        code: 0,
        message: 'No error'
      },
      id: newUser._id.toString()
    })
  }
}
module.exports.getUser = async (req, res, next) => {
  let userId = req.swagger.params.id.value
  let user = await models.User.findById(userId)
  if (user) {
    res.status(200).send({
      status: {
        code: 0,
        message: 'User found successfully.'
      },
      user
    })
  } else {
    res.status(404).send({
      status: {
        code: 1,
        message: 'User not found'
      }
    })
  }
}
module.exports.updateUser = async (req, res, next) => {
  let userId = req.swagger.params.id.value
  let user = await models.User.findById(userId)
  if (user) {
    let username = req.body.username
    user.username = username
    await user.save()
    res.status(200).send({
      status: {
        code: 0,
        message: 'User updated successfully.'
      }
    })
  } else {
    res.status(404).send({
      status: {
        code: 1,
        message: 'User not found'
      }
    })
  }
}
module.exports.deleteUser = async (req, res, next) => {
  let userId = req.swagger.params.id.value
  let user = await models.User.findById(userId)
  if (user) {
    let username = req.body.username
    user.username = username
    await user.delete()
    res.status(200).send({
      status: {
        code: 0,
        message: 'User deleted successfully.'
      }
    })
  } else {
    res.status(404).send({
      status: {
        code: 1,
        message: 'User not found'
      }
    })
  }
}
