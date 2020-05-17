"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class GroupSchema extends Schema {
  up() {
    this.create("groups", table => {
      table.increments();
      table.string("name").notNullable();
      table.text("description");
      table
        .integer("owner_id")
        .unsigned()
        .references("id")
        .inTable("users")
        .onUpdate("CASCADE")
        .onDelete("SET NULL")
        .notNullable();
      table.timestamps();
    });
  }

  down() {
    this.drop("groups");
  }
}

module.exports = GroupSchema;
