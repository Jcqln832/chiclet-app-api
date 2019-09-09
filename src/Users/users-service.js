const UsersService = {
    getAllUsers(knex) {
      return knex.select('*').from('chiclet_users')
    },
  
    insertUser(knex, newUser) {
      return knex
        .insert(newUser)
        .into('chiclet_users')
        .returning('*')
        .then(rows => {
          return rows[0]
        })
    },
  
    getById(knex, id) {
      return knex
        .from('chiclet_users')
        .select('*')
        .where('id', id)
        .first()
    },
  
    deleteUser(knex, id) {
      return knex('chiclet_users')
        .where({ id })
        .delete()
    },
  
    updateUser(knex, id, newUserFields) {
      return knex('chiclet_users')
        .where({ id })
        .update(newUserFields)
    },
  }
  
  module.exports = UsersService