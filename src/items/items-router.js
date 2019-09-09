const express = require('express')
const ItemsService = require('./items-service')
const { requireAuth } = require('../middleware/jwt-auth')

const itemsRouter = express.Router()

itemsRouter
  .route('/')
  .all(requireAuth)
  .get((req, res, next) => {
    ItemsService.getAllUsersItems(req.app.get('db'), 1)
      .then(items => {
        res.json(ItemsService.serializeItems(items))
      })
      .catch(next)
  })

// itemsRouter
//   .route('/month/:monthid')
//   .all(requireAuth)
//   .get((req, res) => {
//     res.json(ItemsService.serializeItems(res.item))
//   })

// itemsRouter.route('/edit/:itemid')
//   .all(requireAuth)
//   .all(checkItemExists)
//   .get((req, res, next) => {
//     ItemsService.getReviewsForItem(
//       req.app.get('db'),
//       req.params.itemid
//     )
//       .catch(next)
//   })

/* async/await syntax for promises */
async function checkItemExists(req, res, next) {
  try {
    const item = await ItemsService.getById(
      req.app.get('db'),
      req.params.thing_id
    )

    if (!item)
      return res.status(404).json({
        error: `Item doesn't exist`
      })

    res.item = item
    next()
  } catch (error) {
    next(error)
  }
}

module.exports = itemsRouter