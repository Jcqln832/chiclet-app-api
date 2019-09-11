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
        content: "First Item",
        user_id: users[0].id,
        index: 201901
      },
      {
        id: 2,
        content: "Second Item",
        user_id: users[0].id,
        index: 201902
      },
      {
        id: 3,
        content: "Item number 3",
        user_id: users[1].id,
        index: 201902
      },
  ]
}

function makeExpectedItem(item) {
  return {
    id: item.id,
    content: item.content,
    user_id: item.user_id
  }
}

function makeMaliciousItem(user) {
  const maliciousItem = {
    id: 911,
    content: 'Naughty naughty very naughty <script>alert("xss");</script> <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">',
    user_id: 2,
    index: 201908
  }
  const expectedItem = {
    ...makeExpectedItem(maliciousItem),
    content: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt; <img src="https://url.to.file.which/does-not.exist">',
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

function seedItemsTables(db, users, items) {

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
