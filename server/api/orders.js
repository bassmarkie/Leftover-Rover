const { EventEmitter } = require('events')

const router = require('express').Router()
const { Order, User, Driver } = require('../db/models')
module.exports = router

const routeRequested = new EventEmitter()
router.routeRequested = routeRequested

const idFinder = req => {
  let id
  if (req.user) {
    id = req.user.dataValues.id
  } else {
    id = 2
  }
  return { id }
}

const findDriver = async (myLat, myLng) => {
  const drivers = await Driver.findAll({
    where: {
      isAvailable: true,
      isActive: true
    }
  })
  let driverList = drivers.map(driver => {
    const latScore = Math.abs(myLat - driver.currentLocationLat)
    const lngScore = Math.abs(myLng - driver.currentLocationLng)
    const score = latScore + lngScore
    return [score, driver.id]
  })

  driverList.sort()
  console.log(driverList)
  let closest = driverList.slice(0, 5)
  const output = closest.map(val => {
    return val[1]
  })
  console.log(output)
  return output
}

// This is the route called when a driver accepts a request. It requires the orderId as the orderId req.params. It does not need to specify the accepted driver, as the reqest will come from that driver. It does require an array of complete driver objects to be passed in as the req.body. Whether the accepting driver is included in this array does not matter.
router.put('/:orderId', async (req, res, next) => {
  // Expects req.body={drivers: [driver1, driver2, driver3, driver4]}
  try {
    const order = await Order.findById(req.params.orderId)

    await Promise.all([
      order.update({
        status: 'ToPickup',
        startLocationLat: req.user.driver.currentLocationLat,
        startLocationLng: req.user.driver.currentLocationLng
      }),
      order.setDriver(req.user.driver)
    ])
    const otherDrivers = req.body.drivers.filter(driver => {
      return driver.id !== req.user.driver.id
    })

    const otherDriverModels = []
    for (const driver of otherDrivers) {
      let temp = await Driver.findById(driver.id)
      otherDriverModels.push(temp)
    }

    for (const driver of otherDriverModels) {
      await driver.update({ isAvailable: true })
    }

    res.json(order)
  } catch (error) {
    console.log(error)
  }
})

router.put('/', async (req, res, next) => {
  try {
    const order = await Order.findById(req.body.id)
    await order.update({
      status: req.body.status,
      pickupTime: req.body.pickupTime
    })
    res.json(order)
  } catch (error) {
    console.log(error)
  }
})

// Route for creating an order when user requests a driver
router.post('/', async (req, res, next) => {
  // req.body = {pickupLocationLat,
  // pickupLocationLng,
  // dropoffLocationLat,
  // dropoffLocationLng,
  // deliveryNotes}

  try {
    const { id } = idFinder(req)
    const drivers = await findDriver(
      req.body.pickupLocationLat,
      req.body.pickupLocationLng
    )
    const driverList = []
    drivers.forEach(async driver => {
      driverList.push(await Driver.findById(driver))
    })

    const orderData = {
      userId: id,
      pickupLocationLat: req.body.pickupLocationLat,
      pickupLocationLng: req.body.pickupLocationLng,
      deliveryLocationLat: req.body.dropoffLocationLat,
      deliveryLocationLng: req.body.dropoffLocationLng,
      deliveryNotes: req.body.deliveryNotes
    }
    const order = await Order.create(orderData)

    driverList.forEach(driver => {
      driver.update({ isAvailable: false })
    })

    routeRequested.emit('routeRequested', order, driverList)

    //This section below needs to be deleted once driver accepting is hooked up - this is just to keep the app from breaking in the meantime

    // I have commented out for now as the driver's order accept button should be working

    // await Promise.all([
    //   order.update({
    //     status: 'ToPickup',
    //     startLocationLat: driverList[0].currentLocationLat,
    //     startLocationLng: driverList[0].currentLocationLng
    //   }),
    //   order.setDriver(driverList[0])
    // ])
    res.json(order)
  } catch (err) {
    next(err)
  }
})
