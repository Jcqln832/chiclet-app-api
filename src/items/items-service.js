const xss = require('xss')
const Treeize = require('treeize')

const ItemsService = {
    getAllUsersItems(knex, id) {
        return knex
        .select('*')
        .from('chiclet_items AS item')
        .where('item.user_id', id)
    },
    getById(knex, id) {
        return knex
         .from('chiclet_items AS item')
         .select('*')
         .where('item.id', id)
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
    serializeItems(items) {
        return items.map(this.serializeItem)
    },
    serializeItem(item) {
        const itemTree = new Treeize()
    
        // Some light hackiness to allow for the fact that `treeize`
        // only accepts arrays of objects, and we want to use a single
        // object.
        const itemData = itemTree.grow([ item ]).getData()[0]
    
        return {
          id: itemData.id,
          item: xss(itemData.content),
          user: itemData.user_id,
          month: itemData.months,
          completed: itemData.completed,
          index: itemData.index
        //   date_created: thingData.date_created,
        }
      },
}

module.exports = ItemsService