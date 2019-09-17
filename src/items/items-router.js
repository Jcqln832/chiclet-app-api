const express = require('express')
const ItemsService = require('./items-service')
const { requireAuth } = require('../middleware/jwt-auth')
const xss = require('xss')

const itemsRouter = express.Router()
const bodyParser = express.json()

itemsRouter
  .route('/')
  .all(requireAuth)

  // get items and post a new item
  .get((req, res, next) => {
    ItemsService.getAllUsersItems(req.app.get('db'), req.user.id)
      .then(items => {
        res.json(ItemsService.serializeItems(items))
      })
      .catch(next)
  })

  .post(bodyParser, (req, res, next) => {
    const { content, index } = req.body
    const user_id = req.user.id
    const newItem = { content, index, user_id }

    for (const field of ["content", "index", "user_id"]) {
      if (!newItem[field]) {
        return res.status(400).send({
          error: { message: `'${field}' is required` }
        })
      }
    }

    ItemsService.insertItem(
      req.app.get('db'),
      newItem
    )
      .then(item => {
        res
         .status(201)
          // .location(path.posix.join(req.originalUrl))
          .json(ItemsService.serializeItem(item))
      })
      .catch(next)
  })

// update item (edit or delete)
itemsRouter
  .route('/:itemId')
  .all(requireAuth)
  //check that this item exists first - send error message if not
  .all((req, res, next) => {
    ItemsService.getById(
      req.app.get('db'),
      req.params.itemId
    )
      .then(item => {
        if (!item) {
          return res.status(404).json({
            error: { message: `Item Not Found` }
          })
        }
        res.item = item
        next()
      })
      .catch(next)
  })

  .get((req, res, next) => {
    ItemsService.getById(req.app.get('db'), req.params.itemId)
      .then(item => {
        res.json(ItemsService.serializeItem(item))
      })
      .catch(next)
  })

  .delete((req, res, next) => {
    ItemsService.deleteItem(
      req.app.get('db'),
      req.params.itemId
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })

  .patch(bodyParser, (req, res, next) => {
    const { content, completed } = req.body
    const newItemFields = { content, completed }

    // array.filter(bool) -- Only values which do not return false will be added to the array
    const numberOfValues = Object.values(newItemFields).filter(Boolean).length

    if(numberOfValues === 0) {
      return res.status(400).json({
        error: {
          message: `Request body must contain either 'content' or new 'completed' status`
        }
      })
    }

    ItemsService.updateItem(
      req.app.get('db'),
      req.params.itemId,
      newItemFields
    )
    // .then(item => {
    //   res.status(201)
    //   // .json(ItemsService.serializeItem(item))
    //   .json(item)
    // })
    .then(numRowsAffected => {
      res.status(204).end()
    })
      .catch(next)
  })


/* async/await syntax for promises */
// async function checkItemExists(req, res, next) {
//   try {
//     const item = await ItemsService.getById(
//       req.app.get('db'),
//       req.params.thing_id
//     )

//     if (!item)
//       return res.status(404).json({
//         error: `Item doesn't exist`
//       })

//     res.item = item
//     next()
//   } catch (error) {
//     next(error)
//   }
// }

module.exports = itemsRouter