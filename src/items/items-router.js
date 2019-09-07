const express = require('express')
const ItemsService = require('./items-service')
const { requireAuth } = require('../middleware/jwt-auth')

const itemsRouter = express.Router()

itemsRouter
  .route('/months')
  .get((req, res, next) => {
    ItemsService.getAllItems(req.app.get('db'))
      .then(items => {
        res.json(ItemsService.serializeItems(items))
      })
      .catch(next)
  })

itemsRouter
  .route('/month/:monthid')
  .all(requireAuth)
  .all(checkThingExists)
  .get((req, res) => {
    res.json(ThingsService.serializeThing(res.thing))
  })

itemsRouter.route('/edit/:itemid')
  .all(requireAuth)
  .all(checkThingExists)
  .get((req, res, next) => {
    ThingsService.getReviewsForThing(
      req.app.get('db'),
      req.params.thing_id
    )
      .then(reviews => {
        res.json(ThingsService.serializeThingReviews(reviews))
      })
      .catch(next)
  })

/* async/await syntax for promises */
async function checkThingExists(req, res, next) {
  try {
    const thing = await ThingsService.getById(
      req.app.get('db'),
      req.params.thing_id
    )

    if (!thing)
      return res.status(404).json({
        error: `Thing doesn't exist`
      })

    res.thing = thing
    next()
  } catch (error) {
    next(error)
  }
}

module.exports = thingsRouter