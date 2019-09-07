const ItemsService = require('../src/items-service')
const knex = require('knex')


describe(`Articles service object`, function() {
    let db
    // test items (use dummy items list from React side!)
    let testItems = [
        {
            id: 1,
            item: "First Item",
            user_id: "reggie",
            month: "January",
            completed: false,
            index: 201901
        },
        {
            id: 2,
            item: "Second Item",
            user_id: "reggie",
            month: "February",
            completed: false,
            index: 201902
        },
        {
            id: 3,
            item: "Another Item",
            user_id: "reggie",
            month: "January",
            completed: false,
            index: 201901
        },

    ]
    //check db connection
    before(() => {
        db = knex({
        client: 'pg',
        connection: process.env.TEST_DB_URL,
       })
    })

    //insert test items into database before the tests
    before(() => {
        return db
        .into('blogful_articles')
        .insert(testArticles)
    })

    //kill open database connection to complete the tests
    after(() => db.destroy())

describe(`getAllArticles()`, () => {
 it(`resolves all articles from 'chiclet_items' table for the current year and user`, () => {
       // test that ArticlesService.getAllArticles gets data from table
       return ItemsService.getAllItems(db)
       .then(actual => {
           expect(actual).to.equal(testArticles)
       })
     })
})
})