const ItemsService = {
    getAllItems(knex, id) {
        return knex
        .select('*')
        .from('chiclet_items AS item')
        .where(item.user_id, id)
    },
    getById(knex, id) {
        return knex
         .from('chiclet_items')
         .select('*')
         .where('id', id)
         .first()
    },
    deleteItem(knex, id) {
        return knex('chiclet_items')
          .where({ id })
          .delete()
    },
    updateItem(knex, id, newItemFields) {
        return knex('chiclet_items')
          .where({ id })
          .update(newItemFields)
    },
    insertItem(knex, newItem) {
        return knex
          .insert(newItem)
          .into('chiclet_items')
          .returning('*')
          .then(rows => rows[0])
    },
}

module.exports = ItemsService