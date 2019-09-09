const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

function makeUsersArray() {
  return [
    {
      id: 1,
      user_name: 'test-user-1',
      password: 'password'
    },
    {
      id: 2,
      user_name: 'test-user-2',
      password: 'password'
    },
    {
      id: 3,
      user_name: 'test-user-3',
      password: 'password'
    }
  ]
}

function makeItemsArray(users) {
  return [
    {
        id: 1,
        item: "First Item",
        author: "reggie",
        month: "January",
        completed: false,
        index: 201901
      },
      {
        id: 2,
        item: "Second Item",
        author: "reggie",
        month: "February",
        completed: false,
        index: 201902
      },
      {
        id: 3,
        item: "Another Item",
        author: "reggie",
        month: "January",
        completed: false,
        index: 201901
      },
  ]
}

function makeExpectedItem(users, item) {
  const user = users
    .find(user => user.id === item.user_id)

  return {
    id: item.id,
    image: item.image,
    title: item.title,
    content: item.content,
    date_created: item.date_created,
    number_of_reviews,
    average_review_rating,
    user: {
      id: user.id,
      user_name: user.user_name,
      full_name: user.full_name,
      nickname: user.nickname,
      date_created: user.date_created,
    },
  }
}

function makeMaliciousItem(user) {
  const maliciousItem = {
    id: 911,
    image: 'http://placehold.it/500x500',
    date_created: new Date().toISOString(),
    title: 'Naughty naughty very naughty <script>alert("xss");</script>',
    user_id: user.id,
    content: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
  }
  const expectedItem = {
    ...makeExpectedItem([user], maliciousItem),
    title: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
    content: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`,
  }
  return {
    maliciousItem,
    expectedItem,
  }
}

function makeItemsFixtures() {
  const testUsers = makeUsersArray()
  const testItems = makeItemsArray(testUsers)
  return { testUsers, testItems }
}

function cleanTables(db) {
  return db.transaction(trx =>
    trx.raw(
    `TRUNCATE
      chiclet_items,
      chiclet_users
    `
  )
  .then(() =>
  Promise.all([
    trx.raw(`ALTER SEQUENCE chiclet_items_id_seq minvalue 0 START WITH 1`),
    trx.raw(`ALTER SEQUENCE chiclet_users_id_seq minvalue 0 START WITH 1`),
    trx.raw(`SELECT setval('chiclet_items_id_seq', 0)`),
    trx.raw(`SELECT setval('chiclet_users_id_seq', 0)`),
  ])
  )
)
}

function seedUsers(db, users) {
  const preppedUsers = users.map(user => ({
    ...user,
    password: bcrypt.hashSync(user.password, 1)
  }))
    return db.into('chiclet_users').insert(preppedUsers)
      .then(() =>
      // update the auto sequence to stay in sync
        db.raw(
           `SELECT setval('chiclet_users_id_seq', ?)`,
           [users[users.length - 1].id],
        )
      )
}

function seedItemsTables(db, users, things, reviews=[]) {

  // use a transaction to group the queries and auto rollback on any failure
  return db.transaction(async trx => {
    await seedUsers(trx, users)
    await trx.into('chiclet_items').insert(items)      
      // update the auto sequence to match the forced id values
      await Promise.all([
        trx.raw(
          `SELECT setval('chiclet_users_id_seq', ?)`,
          [users[users.length - 1].id],
        ),
        trx.raw(
          `SELECT setval('chiclet_items_id_seq', ?)`,
          [items[items.length - 1].id],
        ),
      ])
  })
}

function seedMaliciousItem(db, user, item) {
  return db
    .into('chiclet_users')
    .insert([user])
    .then(() =>
      db
        .into('chiclet_items')
        .insert([item])
    )
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({ user_id: user.id }, secret, {
    subject: user.user_name,
    algorithm: 'HS256',
  })
  return `Bearer ${token}`
}

module.exports = {
  makeUsersArray,
  makeItemsArray,
  makeExpectedItem,
  makeMaliciousItem,

  makeItemsFixtures,
  cleanTables,
  seedItemsTables,
  seedMaliciousItem,
  makeAuthHeader,
  seedUsers,
}
