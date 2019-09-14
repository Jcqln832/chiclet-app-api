const ItemsService = require('../src/items/items-service')
const testHelpers = require('./test-helpers')
const app = require('../src/app')
const knex = require('knex')

describe(`Items Endpoints tests`, function() {
    let db

    // bring in users array and items array for passing as parameters
    const {
        testUsers,
        testItems
    } = testHelpers.makeItemsFixtures()

    before('make knex instance', () => {
        db = knex({
          client: 'pg',
          connection: process.env.TEST_DB_URL,
        })
        app.set('db', db)
      })
    
      after('disconnect from db', () => db.destroy())
    
      before('cleanup', () => db('chiclet_items').truncate())
    
      afterEach('cleanup', () => db('chiclet_items').truncate())

// Unauthorized
      describe(`Unauthorized requests`, () => {
        const testItems = testHelpers.makeItemsArray(testUsers)
    
        // beforeEach('insert items', () => {
        //   return db
        //     .into('chiclet_items')
        //     .insert(testItems)
        // })

        before('insert items', () =>
        testHelpers.seedItemsTables(
          db,
          testUsers,
          testItems,
        )
      )
    
        it(`responds with 401 Unauthorized for GET /api/items`, () => {
          return supertest(app)
            .get('/api/items')
            .expect(401, { error: 'Unauthorized request' })
        })
    
        it(`responds with 401 Unauthorized for POST /api/items`, () => {
          return supertest(app)
            .post('/api/items')
            .send({ content: 'test-item-woo', index: 201903, })
            .expect(401, { error: 'Unauthorized request' })
        })
    
        it(`responds with 401 Unauthorized for GET /api/items/:id`, () => {
          const secondItem = testItems[1]
          return supertest(app)
            .get(`/api/items/${secondItem.id}`)
            .expect(401, { error: 'Unauthorized request' })
        })
    
        it(`responds with 401 Unauthorized for DELETE /api/items/:id`, () => {
          const testItem = testItems[1]
          return supertest(app)
            .delete(`/api/items/${testItem.id}`)
            .expect(401, { error: 'Unauthorized request' })
        })
    
        it(`responds with 401 Unauthorized for PATCH /api/items/:id`, () => {
          const testItem = testItems[1]
          return supertest(app)
            .patch(`/api/items/${testItem.id}`)
            .send({ title: 'updated-title' })
            .expect(401, { error: 'Unauthorized request' })
        })
      })

// Get the items (JWT authorized)
      describe('GET /api/items', () => {
        context(`Given no items`, () => {
          it(`responds with 200 and an empty list`, () => {
            return supertest(app)
              .get('/api/items')
              .set('Authorization', testHelpers.makeAuthHeader(testUsers[0]))
              .expect(200, [])
          })
        })
    
        context('Given there are items in the database', () => {
          const testItems = testHelpers.makeItemsArray(testUsers)
    
          beforeEach('insert items', () => {
            return db
              .into('chiclet_items')
              .insert(testItems)
          })
    
          it('gets the items from the store', () => {
            usersItems = testItems.filter(item => item.user_id === testUsers[0].id)
            return supertest(app)
              .get('/api/items')
              .set('Authorization', testHelpers.makeAuthHeader(testUsers[0]))
              .expect(200, usersItems)
          })
        })
    
        context(`Given an XSS attack item`, () => {
          const { maliciousItem, expectedItem } = testHelpers.makeMaliciousItem(testUsers[0])
    
          beforeEach('insert malicious item', () => {
            return db
              .into('chiclet_items')
              .insert([maliciousItem])
          })
    
          it('removes XSS attack content', () => {
            return supertest(app)
              .get(`/api/items`)
              .set('Authorization', testHelpers.makeAuthHeader(testUsers[0]))
              .expect(200)
              .expect(res => {
                expect(res.body[0].content).to.eql(expectedItem.content)
              })
          })
        })
      })

      describe('DELETE /api/items/:item_id', () => {
        context(`Given no items`, () => {
          it(`responds 404 when item doesn't exist`, () => {
            return supertest(app)
              .delete(`/api/items/123`)
              .set('Authorization', testHelpers.makeAuthHeader(testUsers[0]))
              .expect(404, {
                error: { message: `Item Not Found` }
              })
          })
        })
    
        context('Given there are items in the database', () => {
          const testItems = testHelpers.makeItemsArray(testUsers)
    
          beforeEach('insert items', () => {
            return db
              .into('chiclet_items')
              .insert(testItems)
          })
    
          it('removes the item by ID from the store', () => {
            const idToRemove = 2
            const usersItems = testItems.filter(item => item.user_id === testUsers[0].id)
            const expectedItems = usersItems.filter(item => item.id !== idToRemove)
            return supertest(app)
              .delete(`/api/items/${idToRemove}`)
              .set('Authorization', testHelpers.makeAuthHeader(testUsers[0]))
              .expect(204)
              .then(() =>
                supertest(app)
                  .get(`/api/items`)
                  .set('Authorization', testHelpers.makeAuthHeader(testUsers[0]))
                  .expect(expectedItems)
              )
          })
        })
      })
  
      describe('POST /api/items', () => {
        // ['content', 'completed'].forEach(field => {
        //   const newItem = {
        //     content: 'test-item content',
        //     index: 201903
        //   }
    
        //   it(`responds with 400 missing '${field}' if not supplied`, () => {
        //     delete newItem[field]
    
        //     return supertest(app)
        //       .post(`/api/items`)
        //       .send(newItem)
        //       .set('Authorization', testHelpers.makeAuthHeader(testUsers[0]))
        //       .expect(400, {
        //         error: { message: `'${field}' is required` }
        //       })
        //   })
        // })
        it('adds a new item to the store', () => {
            const newItem = {
              content: 'test item content',
              user_id: 1,
              completed: 'false',
              index: '201907'
            }
            return supertest(app)
              .post(`/api/items`)
              .send(newItem)
              .set('Authorization', testHelpers.makeAuthHeader(testUsers[0]))
              .expect(201)
              .expect(res => {
                expect(res.body.content).to.eql(newItem.content)
                expect(res.body).to.have.property('id')
              })
              // .then(res =>
              //   supertest(app)
              //     .get(`/api/items/${res.body.id}`)
              //     .set('Authorization', testHelpers.makeAuthHeader(testUsers[0]))
              //     .expect(res.body)
              //     .expect(res.body.content).to.eql(newItem.content)
              // )
          })
      
          it('removes XSS attack content from response', () => {
            const { maliciousItem, expectedItem } = testHelpers.makeMaliciousItem(testUsers[0])
            return supertest(app)
              .post(`/api/items`)
              .send(maliciousItem)
              .set('Authorization', testHelpers.makeAuthHeader(testUsers[0]))
              .expect(201)
              .expect(res => {
                expect(res.body.content).to.eql(expectedItem.content)
            
              })
          })
        })
      
        describe(`PATCH /api/items/:item_id`, () => {
          context(`Given no items`, () => {
            it(`responds with 404`, () => {
              const itemId = 123456
              return supertest(app)
                .patch(`/api/items/${itemId}`)
                .set('Authorization', testHelpers.makeAuthHeader(testUsers[0]))
                .expect(404, { error: { message: `Item Not Found` } })
            })
          })
      
          context('Given there are items in the database', () => {
            const testItems = testHelpers.makeItemsArray(testUsers)
      
            beforeEach('insert items', () => {
              return db
                .into('chiclet_items')
                .insert(testItems)
            })
      
            it('responds with 204 and updates the item', () => {
              const idToUpdate = 2
              const updateItem = {
                content: 'updated item content',
              }
              const expectedItem = {
                ...testItems[idToUpdate - 1],
                ...updateItem
              }
              return supertest(app)
                .patch(`/api/items/${idToUpdate}`)
                .set('Authorization', testHelpers.makeAuthHeader(testUsers[0]))
                .send(updateItem)
                .expect(204)
                 .then(() =>
                  supertest(app)
                    .get(`/api/items/${idToUpdate}`)
                    .set('Authorization', testHelpers.makeAuthHeader(testUsers[0]))
                    .expect(expectedItem)
                )
            })
      
            it(`responds with 400 when no required fields supplied`, () => {
              const idToUpdate = 2
              return supertest(app)
                .patch(`/api/items/${idToUpdate}`)
                .set('Authorization', testHelpers.makeAuthHeader(testUsers[0]))
                .send({ irrelevantField: 'foo' })
                .expect(400, {
                  error: {
                    message: `Request body must contain either content or new completed status`
                  }
                })
            })
      
            // it(`responds with 204 when updating only a subset of fields`, () => {
            //   const idToUpdate = 2
            //   const updateItem = {
            //     content: 'updated item content',
            //   }
            //   const expectedItem = {
            //     ...testItems[idToUpdate - 1],
            //     ...updateItem
            //   }
      
            //   return supertest(app)
            //     .patch(`/api/items/${idToUpdate}`)
            //     .set('Authorization', testHelpers.makeAuthHeader(testUsers[0]))
            //     .send({
            //       ...updateItem,
            //       fieldToIgnore: 'should not be in GET response'
            //     })
            //     .expect(204)
            //     .then(res =>
            //       supertest(app)
            //         .get(`/api/items/${idToUpdate}`)
            //         .set('Authorization', testHelpers.makeAuthHeader(testUsers[0]))
            //         .expect(expectedItem)
            //     )
            // })

        })
    })

  })
