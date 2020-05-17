"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class FilesSchema extends Schema {
  up() {
    this.create("files", table => {
      table.increments();
      table.string("file").notNullable();
      table.string("name").notNullable();
      table.string("type", 20);
      table.string("subtype", 20);
      table
        .integer("surgery_id")
        .unsigned()
        .references("id")
        .inTable("surgeries")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      table.timestamps();
    });
  }

  down() {
    this.drop("files");
  }
}

module.exports = FilesSchema;
