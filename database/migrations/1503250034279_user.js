'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class UserSchema extends Schema {
  up() {
    this.create('users', (table) => {
      table.increments().notNullable();
      table.string('username', 80).notNullable();
      table.string('email', 254).notNullable().unique();
      table.string('password', 60).notNullable();
      table.string('gender', 1).notNullable();
      table.string('redirect_url');
      table.timestamp('birthday');
      table.string('token');
      table.boolean('activated').defaultTo(false);
      table.timestamp('token_created_at');
      table.timestamps();
    });
  }

  down() {
    this.drop('users');
  }
}

module.exports = UserSchema;
