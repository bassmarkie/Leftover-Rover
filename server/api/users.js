const router = require('express').Router()
const { User, Driver } = require('../db/models')
module.exports = router

router.get('/', async (req, res, next) => {
  try {
    const users = await User.findAll({
      // explicitly select only the id and email fields - even though
      // users' passwords are encrypted, it won't help if we just
      // send everything to anyone who asks!
      attributes: ['id', 'email']
    })
    res.json(users)
  } catch (err) {
    next(err)
  }
})

router.get('/:userId', async (req, res, next) => {
  try {
    const id = req.params.userId
    const driver = await Driver.findOne({
      where: { userId: id }
    })
    let user
    if (driver) {
      user = await User.findById(id, {
        include: [{ model: Driver, where: { userId: id } }]
      })
    } else {
      user = await User.findById(id)
    }
    res.json(user)
  } catch (err) {
    next(err)
  }
})
