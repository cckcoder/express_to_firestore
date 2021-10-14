const express = require('express')
const router = express.Router()

const restaurants = require('../data.js')

let currentShop = 6

router.get('/', (req, res) => {
   res.json(restaurants)
})

router.get('/:id', (req, res) => {
   const id = Number.parseInt(req.params.id, 10)
   const shop = restaurants.find((shop) => shop.id === id)
    res.json(shop)
})

router.post('/', (req, res) => {
   currentShop += 1
   const newShop = {
      id: currentShop,
      ...req.body
   }

   restaurants.push(newShop)
   res.json(restaurants)
})


router.put('/:id', (req, res) => {
   const id = Number.parseInt(req.params.id, 10)
   const shopIndex = restaurants.findIndex((shop) => shop.id === id)
   const updateShop = {
      id: id,
      ...req.body
   }

   restaurants[shopIndex] = updateShop
   res.json(updateShop)
})

router.delete('/:id', (req, res) => {
   const id = Number.parseInt(req.params.id, 10)
   const shopIndex = restaurants.findIndex((shop) => shop.id === id)
   restaurants.splice(shopIndex, 1)

   res.sendStatus(204)
})

module.exports = router