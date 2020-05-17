'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class UsersGroupsSchema extends Schema {
  up() {
    this.create('user_group', (table) => {
      table.increments();
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('SET NULL')
        .notNullable();
      table
        .integer('group_id')
        .unsigned()
        .references('id')
        .inTable('groups')
        .onUpdate('CASCADE')
        .onDelete('SET NULL')
        .notNullable();
    });
  }

  down() {
    this.drop('user_group');
  }
}

module.exports = UsersGroupsSchema;
